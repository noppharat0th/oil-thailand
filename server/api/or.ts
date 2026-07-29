import { parseStringPromise } from 'xml2js'

export default defineEventHandler(async (event) => {
    try {
        const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <CurrentOilPrice xmlns="http://www.pttor.com">
            <Language>thai</Language>
            </CurrentOilPrice>
        </soap:Body>
        </soap:Envelope>`

        const response = await fetch('https://orapiweb.pttor.com/oilservice/OilPrice.asmx', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': '"http://www.pttor.com/CurrentOilPrice"'
            },
            body: xmlBody
        })

        if (!response.ok) {
            throw new Error(`PTTOR API returned ${response.status}: ${await response.text()}`)
        }

        const xmlResponse = await response.text()



        const parsedSoap: any = await parseStringPromise(xmlResponse, {
            explicitArray: true,
            tagNameProcessors: [(name) => name.replace(/^[^:]+:/, '')]
        })

        const innerXml =
            parsedSoap['Envelope']?.['Body']?.[0]?.['CurrentOilPriceResponse']?.[0]?.['CurrentOilPriceResult']?.[0]

        if (!innerXml) {
            throw new Error(`ไม่พบข้อมูลใน SOAP response. Keys: ${JSON.stringify(Object.keys(parsedSoap))}`)
        }

        const unescapedXml = innerXml
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")

        const finalData: any = await parseStringPromise(unescapedXml)

        const items: any[] = finalData?.PTTOR_DS?.FUEL || []

        if (items.length === 0) {
            throw new Error(`ไม่พบรายการราคาน้ำมัน. Keys: ${JSON.stringify(Object.keys(finalData))}`)
        }

        const oilPrices = items.map((item: any) => ({
            product: item.PRODUCT?.[0] ?? 'Unknown',
            price: parseFloat(item.PRICE?.[0] ?? '0') || 0,
            priceDate: item.PRICE_DATE?.[0] ?? null
        }))

        return {
            success: true,
            brand: 'PTT',
            updatedAt: new Date().toISOString(),
            data: oilPrices
        }

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch oil prices: ${error.message}`
        })
    }
})

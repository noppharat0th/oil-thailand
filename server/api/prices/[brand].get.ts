import * as cheerio from 'cheerio'

const PRICE_CONFIG = {
    URL: "http://gasprice.kapook.com/gasprice.php",
    SELECTOR: {
        ITEMS: "ul > li",
        NAME: ".min-w-0.flex-1 > p.truncate",
        PRICE: ".shrink-0.text-right > p.text-xl"
    }
}

export default defineEventHandler(async (event) => {
    try {
        const rawBrand = getRouterParam(event, 'brand')
        const brand = (rawBrand || 'ptt').toLowerCase().replace('_', '')

        const sectionId = `#brand-${brand}`

        const body: string = await $fetch(PRICE_CONFIG.URL, { method: "GET" })
        const $ = cheerio.load(body)

        let priceDate = null
        const dateText = $("h2.text-lg").text().replace('อัปเดตราคาน้ำมันล่าสุด', '').trim()
        if (dateText) {
            priceDate = dateText
        }

        const oilPrices: any[] = []

        const items = $(`${sectionId} ${PRICE_CONFIG.SELECTOR.ITEMS}`)

        items.each((_, el) => {
            const name = $(el).find(PRICE_CONFIG.SELECTOR.NAME).text().trim()
            const priceText = $(el).find(PRICE_CONFIG.SELECTOR.PRICE).text().trim()
            const price = parseFloat(priceText) || 0

            if (name && priceText) {
                oilPrices.push({
                    product: name,
                    price: price,
                    priceDate: priceDate
                })
            }
        })

        if (oilPrices.length === 0) {
            throw new Error(`ไม่พบรายการราคาน้ำมันจาก Kapook สำหรับปั๊ม ${rawBrand}`)
        }

        return {
            success: true,
            brand: rawBrand?.toUpperCase(),
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

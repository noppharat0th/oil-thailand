export const fetch_price = async (brand: string = 'ptt') => {
    try {
        const brands = ['ptt', 'bcp', 'shell', 'caltex', 'pt', 'susco']
        let result = []

        for (const brand of brands) {
            try {
                const res = await fetch(`/api/prices/${brand}`)
                const data = await res.json()
                result.push(data)
                // console.log(`=== ${brand.toUpperCase()} ===`, data)
            } catch (e) {
                console.error(e)
            }
        }
        return result
    } catch (e) {
        console.error(e)
    }
}
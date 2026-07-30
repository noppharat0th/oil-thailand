export const fetch_price = async (brand: string = 'ptt') => {
    try {
        const brands = ['ptt', 'bcp', 'shell', 'caltex', 'pt', 'susco']

        for (const brand of brands) {
            try {
                const res = await fetch(`/api/prices/${brand}`)
                const data = await res.json()
                // console.log(`=== ${brand.toUpperCase()} ===`, data)
                return data
            } catch (e) {
                console.error(e)
            }
        }
    } catch (e) {
        console.error(e)
    }
}
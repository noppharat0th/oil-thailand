export const findLocation = async () => {
    try {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                (error) => {
                    console.error(`Error getting location: ${error.message}`);
                },
                {
                    // enableHighAccuracy: true, // Request precise GPS data if available
                    // timeout: 5000,            // Wait maximum of 5 seconds
                    // maximumAge: 0             // Do not use cached location data
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    } catch (e) {

    }
}
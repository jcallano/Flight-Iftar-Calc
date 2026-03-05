export interface Airport {
    iata: string;
    name: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
}

export const OMAN_AIR_AIRPORTS: Airport[] = [
    { iata: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', lat: 23.593, lng: 58.284 },
    { iata: 'SLL', name: 'Salalah Airport', city: 'Salalah', country: 'Oman', lat: 17.0387, lng: 54.0913 },
    { iata: 'DQM', name: 'Duqm Airport', city: 'Duqm', country: 'Oman', lat: 19.501944, lng: 57.634167 },
    { iata: 'KHS', name: 'Khasab Airport', city: 'Khasab', country: 'Oman', lat: 26.171, lng: 56.2406 },
    { iata: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', lat: 26.27083, lng: 50.63361 },
    { iata: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq', lat: 33.2625, lng: 44.23444 },
    { iata: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', lat: 31.7225, lng: 35.993 },
    { iata: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', lat: 29.2266, lng: 47.9688 },
    { iata: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', lat: 25.26059, lng: 51.61376 },
    { iata: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', lat: 26.471, lng: 49.798 },
    { iata: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lng: 39.1565 },
    { iata: 'MED', name: 'Prince Mohammad Bin Abdulaziz Airport', city: 'Medina', country: 'Saudi Arabia', lat: 24.5534, lng: 39.7051 },
    { iata: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9582, lng: 46.7007 },
    { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', lat: 25.2528, lng: 55.3644 },
    { iata: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh', lat: 23.8433, lng: 90.3977 },
    { iata: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', lat: 13.199379, lng: 77.710136 },
    { iata: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', lat: 12.98222, lng: 80.16361 },
    { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', lat: 28.556160, lng: 77.100281 },
    { iata: 'GOX', name: 'Manohar International Airport', city: 'Goa', country: 'India', lat: 15.73, lng: 73.8633 },
    { iata: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', lat: 17.23, lng: 78.4319 },
    { iata: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', lat: 10.1533333, lng: 76.3881639 },
    { iata: 'CCJ', name: 'Calicut International Airport', city: 'Kozhikode', country: 'India', lat: 11.1368, lng: 75.9553 },
    { iata: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', country: 'India', lat: 26.7606, lng: 80.8894 },
    { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', lat: 19.08861, lng: 72.86806 },
    { iata: 'TRV', name: 'Thiruvananthapuram International Airport', city: 'Thiruvananthapuram', country: 'India', lat: 8.48028, lng: 76.92000 },
    { iata: 'CGK', name: 'Soekarno–Hatta International Airport', city: 'Jakarta', country: 'Indonesia', lat: -6.12556, lng: 106.65583 },
    { iata: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.74333, lng: 101.69806 },
    { iata: 'MLE', name: 'Velana International Airport', city: 'Malé', country: 'Maldives', lat: 4.19167, lng: 73.52889 },
    { iata: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan', lat: 24.90667, lng: 67.16083 },
    { iata: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', lat: 14.50833, lng: 121.01972 },
    { iata: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia', lat: 55.97278, lng: 37.41472 },
    { iata: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', lat: 7.18111, lng: 79.88361 },
    { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', lat: 13.69250, lng: 100.75000 },
    { iata: 'TAS', name: 'Tashkent International Airport', city: 'Tashkent', country: 'Uzbekistan', lat: 41.257861, lng: 69.2811861 },
    { iata: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', lat: 30.12194, lng: 31.40556 },
    { iata: 'ZNZ', name: 'Abeid Amani Karume International Airport', city: 'Zanzibar', country: 'Tanzania', lat: -6.222, lng: 39.225 },
    { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', lat: 55.61806, lng: 12.65611 },
    { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', lat: 49.00972, lng: 2.54778 },
    { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.03333, lng: 8.57056 },
    { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.35389, lng: 11.78611 },
    { iata: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', lat: 45.63000, lng: 8.72306 },
    { iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy', lat: 41.80028, lng: 12.23889 },
    { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.451542, lng: 8.564572 },
    { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', lat: 51.47750, lng: -0.46139 },
];

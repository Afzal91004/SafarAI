const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,

  history: [
    {
      role: "user",
      parts: [
        {
          text: "Create a detailed travel plan for the destination: Manali, spanning 5 days and 4 nights, designed for Friends Getaway with a VIP budget. Include transportation options (flight details if budget allows or other suitable alternatives) with price and booking URL. Provide a list of hotel options, including hotel name, address, price, image URL, geo-coordinates, and rating. Suggest nearby attractions with details: place name, description, image URL, geo-coordinates, ticket pricing, and estimated travel time to each location. Generate a day-by-day itinerary for 5 days with recommended visit times,everything formatted in JSON.\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "destination": "Manali",\n  "tripType": "Friends Getaway",\n  "budget": "VIP",\n  "duration": "5 days & 4 nights",\n  "transportation": {\n    "flight": {\n      "option": "Direct Flight from Delhi to Kullu-Manali Airport (KUU)",\n      "price": "₹10,000 - ₹15,000 (round trip per person)",\n      "bookingURL": "https://www.makemytrip.com/flights/",\n      "alternative": "Train to Chandigarh (approx. ₹2,000 per person) followed by a private cab to Manali (approx. ₹5,000 per car)",\n      "alternativeBookingURL": "https://www.irctc.co.in/"\n    }\n  },\n  "hotels": [\n    {\n      "name": "The Oberoi, Manali",\n      "address": "Old Manali, Himachal Pradesh 175131",\n      "price": "₹25,000 - ₹50,000 per night",\n      "imageURL": "https://www.oberoihotels.com/hotels/manali/images/hotel/the-oberoi-manali-exterior.jpg",\n      "geoCoordinates": "32.2473, 77.1805",\n      "rating": "4.8"\n    },\n    {\n      "name": "The Himalayan",\n      "address": "Vashisht Village, Manali, Himachal Pradesh 175131",\n      "price": "₹15,000 - ₹30,000 per night",\n      "imageURL": "https://www.thehimalayanmanali.com/images/hotel/the-himalayan-manali-exterior.jpg",\n      "geoCoordinates": "32.2488, 77.1819",\n      "rating": "4.5"\n    },\n    {\n      "name": "The Manu Maharani",\n      "address": "Old Manali, Himachal Pradesh 175131",\n      "price": "₹10,000 - ₹20,000 per night",\n      "imageURL": "https://www.manumaharani.com/images/hotel/the-manu-maharani-manali-exterior.jpg",\n      "geoCoordinates": "32.2465, 77.1798",\n      "rating": "4.2"\n    }\n  ],\n  "attractions": [\n    {\n      "name": "Hidimba Devi Temple",\n      "description": "Ancient cave temple dedicated to Hidimba Devi, wife of Bhima from the Hindu epic Mahabharata.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/himbadevi_temple.jpg",\n      "geoCoordinates": "32.2459, 77.1819",\n      "ticketPricing": "Free entry",\n      "estimatedTravelTime": "10 minutes from Manali center"\n    },\n    {\n      "name": "Rohtang Pass",\n      "description": "High altitude mountain pass offering breathtaking views of the Himalayas and snow-capped peaks.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/rohtang-pass-20.jpg",\n      "geoCoordinates": "32.3126, 77.1828",\n      "ticketPricing": "₹500 per person",\n      "estimatedTravelTime": "1 hour 30 minutes from Manali"\n    },\n    {\n      "name": "Solang Valley",\n      "description": "Popular destination for adventure activities like paragliding, skiing, and zorbing.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/solang-valley-himachal.jpg",\n      "geoCoordinates": "32.2898, 77.1845",\n      "ticketPricing": "Varies depending on the activity",\n      "estimatedTravelTime": "1 hour from Manali"\n    },\n    {\n      "name": "Vashisht Hot Springs",\n      "description": "Natural hot springs believed to have medicinal properties, ideal for a relaxing soak.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/vashisht_hot_springs_manali.jpg",\n      "geoCoordinates": "32.2487, 77.1805",\n      "ticketPricing": "₹20 per person",\n      "estimatedTravelTime": "15 minutes from Manali center"\n    },\n    {\n      "name": "Beas River",\n      "description": "Picturesque river flowing through Manali, offering opportunities for rafting, fishing, and riverside picnics.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/beas-river-manali.jpg",\n      "geoCoordinates": "32.2516, 77.1818",\n      "ticketPricing": "N/A",\n      "estimatedTravelTime": "Accessible from various points in Manali"\n    },\n    {\n      "name": "Jogini Falls",\n      "description": "Scenic waterfall cascading down a cliff, surrounded by lush greenery.",\n      "imageURL": "https://www.incredibleindia.org/sites/default/files/styles/large/public/jogini-falls_manali.jpg",\n      "geoCoordinates": "32.2369, 77.1972",\n      "ticketPricing": "N/A",\n      "estimatedTravelTime": "30 minutes from Manali center"\n    }\n  ],\n  "itinerary": {\n    "day1": {\n      "morning": {\n        "activity": "Arrival at Kullu-Manali Airport (KUU) or Chandigarh, followed by transfer to your hotel in Manali.",\n        "time": "10:00 AM - 1:00 PM",\n        "notes": "Check-in to your hotel, settle in, and relax after the journey."\n      },\n      "afternoon": {\n        "activity": "Explore the charming streets of Old Manali.",\n        "time": "2:00 PM - 5:00 PM",\n        "notes": "Visit local shops, cafes, and soak in the laid-back vibes of the area."\n      },\n      "evening": {\n        "activity": "Dinner at a traditional Himachali restaurant in Old Manali.",\n        "time": "7:00 PM - 9:00 PM",\n        "notes": "Enjoy delicious local cuisine and experience the ambiance of a Himalayan eatery."\n      }\n    },\n    "day2": {\n      "morning": {\n        "activity": "Visit the Hidimba Devi Temple, an ancient cave temple.",\n        "time": "9:00 AM - 11:00 AM",\n        "notes": "Explore the temple and its surrounding gardens, learn about its history and significance."\n      },\n      "afternoon": {\n        "activity": "Relax and unwind at the Vashisht Hot Springs.",\n        "time": "12:00 PM - 3:00 PM",\n        "notes": "Enjoy a rejuvenating soak in the naturally heated springs, known for their medicinal properties."\n      },\n      "evening": {\n        "activity": "Experience a traditional Himachali dinner and cultural performance.",\n        "time": "7:00 PM - 10:00 PM",\n        "notes": "Enjoy a delightful meal and witness the vibrant culture of the region through traditional music and dance."\n      }\n    },\n    "day3": {\n      "morning": {\n        "activity": "Explore the scenic beauty of Solang Valley.",\n        "time": "9:00 AM - 1:00 PM",\n        "notes": "Enjoy breathtaking views of the Himalayas, participate in adventure activities like paragliding or zorbing."\n      },\n      "afternoon": {\n        "activity": "Lunch at a cafe in Solang Valley.",\n        "time": "1:00 PM - 2:00 PM",\n        "notes": "Grab a bite to eat at a local cafe and soak in the mountain scenery."\n      },\n      "evening": {\n        "activity": "Go for a leisurely walk along the Beas River.",\n        "time": "5:00 PM - 7:00 PM",\n        "notes": "Enjoy the serene beauty of the river, take photos, and relax in the peaceful environment."\n      }\n    },\n    "day4": {\n      "morning": {\n        "activity": "Excursion to Rohtang Pass, experiencing the thrill of high altitude driving.",\n        "time": "8:00 AM - 1:00 PM",\n        "notes": "Witness the majestic snow-capped peaks and capture panoramic views of the Himalayas."\n      },\n      "afternoon": {\n        "activity": "Lunch at a restaurant near Rohtang Pass.",\n        "time": "1:00 PM - 2:00 PM",\n        "notes": "Enjoy a quick meal and enjoy the breathtaking views before heading back."\n      },\n      "evening": {\n        "activity": "Visit the Jogini Falls, a picturesque waterfall nestled in nature.",\n        "time": "5:00 PM - 7:00 PM",\n        "notes": "Hike through the lush forest to reach the falls and capture its beauty."\n      }\n    },\n    "day5": {\n      "morning": {\n        "activity": "Enjoy a relaxed morning at your hotel.",\n        "time": "9:00 AM - 11:00 AM",\n        "notes": "Have breakfast at the hotel, pack your belongings, and soak in the last moments of your Manali trip."\n      },\n      "afternoon": {\n        "activity": "Check out from your hotel and head to the airport or Chandigarh for your departure.",\n        "time": "12:00 PM - 3:00 PM",\n        "notes": "Enjoy a final lunch at a restaurant near the airport or station before your journey back."\n      },\n      "evening": {\n        "activity": "Departure from Kullu-Manali Airport (KUU) or Chandigarh, bidding farewell to the beautiful mountains of Manali.",\n        "time": "6:00 PM onwards",\n        "notes": "Reflect on the memorable experiences you had in Manali and look forward to your next adventure."\n      }\n    }\n  }\n}\n```\n\n**Note:** This itinerary is a suggestion and can be customized based on your interests and preferences. You can adjust the time allocations for each activity and explore other attractions in Manali as per your liking. \n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
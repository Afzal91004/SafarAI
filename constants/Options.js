export const SelectTravelerlist = [
  {
    id: 1,
    title: "Just Me",
    description: "Discover the world solo, at your own pace.",
    uri: require("../assets/images/solo-traveller.jpg"),
    people: "1",
  },
  {
    id: 2,
    title: "Family Fun",
    description: "Unforgettable moments with the whole family.",
    uri: require("../assets/images/family-traveller.jpeg"),
    people: "3+",
  },
  {
    id: 3,
    title: "Couples Retreat",
    description: "Cherish romantic escapes together.",
    uri: require("../assets/images/couples.jpg"),
    people: "2",
  },
  {
    id: 4,
    title: "Friends Getaway",
    description: "Make memories with your favorite crew.",
    uri: require("../assets/images/friends-travller.jpg"),
    people: "3+",
  },
];

export const AI_PROMPT =
  "Create a detailed travel plan for the destination: {location}, spanning {totalDays} days and {totalNight} nights, designed for {traveler} with a {budget} budget. Include transportation options (flight details if budget allows or other suitable alternatives) with price and booking URL. Provide a list of hotel options, including hotel name, address, price, image URL, geo-coordinates, and rating. Suggest nearby attractions with details: place name, description, image URL, geo-coordinates, ticket pricing, and estimated travel time to each location. Generate a day-by-day itinerary for {totalDays} days with recommended visit times,everything formatted in JSON.";

export const suggestedCities = [
  {
    city: "Delhi",
    places: [
      {
        name: "India Gate",
        description:
          "A war memorial dedicated to Indian soldiers who died in World War I.",
        place_id: "place_id_india_gate",
        geometry: {
          location: {
            lat: 28.6129,
            lng: 77.2295,
          },
        },
      },
      {
        name: "Qutub Minar",
        description:
          "A UNESCO World Heritage Site and the tallest brick minaret in the world.",
        place_id: "place_id_qutub_minar",
        geometry: {
          location: {
            lat: 28.5245,
            lng: 77.1855,
          },
        },
      },
    ],
  },
  {
    city: "Mumbai",
    places: [
      {
        name: "Gateway of India",
        description: "An iconic arch monument overlooking the Arabian Sea.",
        place_id: "place_id_gateway_of_india",
        geometry: {
          location: {
            lat: 18.9218,
            lng: 72.8347,
          },
        },
      },
      {
        name: "Marine Drive",
        description:
          "A scenic promenade along the coast, popular for its sunset views.",
        place_id: "place_id_marine_drive",
        geometry: {
          location: {
            lat: 18.9529,
            lng: 72.8258,
          },
        },
      },
    ],
  },
  {
    city: "Jaipur",
    places: [
      {
        name: "Hawa Mahal",
        description:
          "Known as the Palace of Winds, famous for its unique façade.",
        place_id: "place_id_hawa_mahal",
        geometry: {
          location: {
            lat: 26.9934,
            lng: 75.8267,
          },
        },
      },
      {
        name: "Amber Fort",
        description:
          "A majestic fort located on a hilltop, known for its architectural beauty.",
        place_id: "place_id_amber_fort",
        geometry: {
          location: {
            lat: 26.9855,
            lng: 75.8513,
          },
        },
      },
    ],
  },
  {
    city: "Agra",
    places: [
      {
        name: "Taj Mahal",
        description:
          "A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
        place_id: "place_id_taj_mahal",
        geometry: {
          location: {
            lat: 27.1751,
            lng: 78.0421,
          },
        },
      },
      {
        name: "Agra Fort",
        description:
          "A historical fort that offers panoramic views of the Taj Mahal.",
        place_id: "place_id_agra_fort",
        geometry: {
          location: {
            lat: 27.1767,
            lng: 78.0081,
          },
        },
      },
    ],
  },
  {
    city: "Bangalore",
    places: [
      {
        name: "Bangalore Palace",
        description:
          "A royal palace with Tudor-style architecture and lush gardens.",
        place_id: "place_id_bangalore_palace",
        geometry: {
          location: {
            lat: 12.9995,
            lng: 77.5909,
          },
        },
      },
      {
        name: "Lalbagh Botanical Garden",
        description:
          "A sprawling garden known for its glasshouse and diverse flora.",
        place_id: "place_id_lalbagh_botanical_garden",
        geometry: {
          location: {
            lat: 12.9538,
            lng: 77.5835,
          },
        },
      },
    ],
  },
  {
    city: "Cochin",
    places: [
      {
        name: "Fort Kochi",
        description:
          "Known for its colonial architecture, beaches, and Chinese fishing nets.",
        place_id: "place_id_fort_kochi",
        geometry: {
          location: {
            lat: 9.9656,
            lng: 76.221,
          },
        },
      },
      {
        name: "Backwaters of Alleppey",
        description:
          "A network of lagoons and canals, ideal for houseboat stays and sightseeing.",
        place_id: "place_id_backwaters_alappuzha",
        geometry: {
          location: {
            lat: 9.25,
            lng: 76.34,
          },
        },
      },
    ],
  },
  {
    city: "Goa",
    places: [
      {
        name: "Baga Beach",
        description:
          "A popular beach known for water sports, nightlife, and shacks.",
        place_id: "place_id_baga_beach",
        geometry: {
          location: {
            lat: 15.5521,
            lng: 73.7516,
          },
        },
      },
      {
        name: "Basilica of Bom Jesus",
        description:
          "A UNESCO World Heritage Site and an example of Baroque architecture.",
        place_id: "place_id_basilica_of_bom_jesus",
        geometry: {
          location: {
            lat: 15.4946,
            lng: 73.9303,
          },
        },
      },
    ],
  },
  {
    city: "Varanasi",
    places: [
      {
        name: "Kashi Vishwanath Temple",
        description:
          "A famous Hindu temple dedicated to Lord Shiva, known for its spiritual significance.",
        place_id: "place_id_kashi_vishwanath_temple",
        geometry: {
          location: {
            lat: 25.3176,
            lng: 82.9739,
          },
        },
      },
      {
        name: "Dashashwamedh Ghat",
        description:
          "The main ghat on the river Ganges, known for its Ganga Aarti.",
        place_id: "place_id_dashashwamedh_ghat",
        geometry: {
          location: {
            lat: 25.3178,
            lng: 82.9707,
          },
        },
      },
    ],
  },
  {
    city: "Udaipur",
    places: [
      {
        name: "City Palace",
        description:
          "A complex of palaces located in Udaipur, showcasing intricate peacock mosaics.",
        place_id: "place_id_city_palace",
        geometry: {
          location: {
            lat: 24.5854,
            lng: 74.5792,
          },
        },
      },
      {
        name: "Lake Pichola",
        description:
          "A beautiful lake surrounded by hills, palaces, and temples.",
        place_id: "place_id_lake_pichola",
        geometry: {
          location: {
            lat: 24.5754,
            lng: 73.6712,
          },
        },
      },
    ],
  },
  {
    city: "Rishikesh",
    places: [
      {
        name: "Triveni Ghat",
        description:
          "A sacred bathing spot at the confluence of three rivers, famous for Ganga Aarti.",
        place_id: "place_id_triveni_ghat",
        geometry: {
          location: {
            lat: 30.0864,
            lng: 78.275,
          },
        },
      },
      {
        name: "Laxman Jhula",
        description:
          "An iconic suspension bridge over the Ganges, connecting the towns of Rishikesh.",
        place_id: "place_id_laxman_jhula",
        geometry: {
          location: {
            lat: 30.0903,
            lng: 78.2975,
          },
        },
      },
    ],
  },
  {
    city: "Mysore",
    places: [
      {
        name: "Mysore Palace",
        description:
          "A historical palace and a UNESCO World Heritage Site, known for its grandeur.",
        place_id: "place_id_mysore_palace",
        geometry: {
          location: {
            lat: 12.3051,
            lng: 76.6558,
          },
        },
      },
      {
        name: "Brindavan Gardens",
        description: "Famous for its beautiful gardens and musical fountain.",
        place_id: "place_id_brindavan_gardens",
        geometry: {
          location: {
            lat: 12.3946,
            lng: 76.5905,
          },
        },
      },
    ],
  },
  {
    city: "Khajuraho",
    places: [
      {
        name: "Khajuraho Temples",
        description:
          "A group of Hindu and Jain temples famous for their intricate erotic sculptures.",
        place_id: "place_id_khajuraho_temples",
        geometry: {
          location: {
            lat: 24.8324,
            lng: 79.9193,
          },
        },
      },
    ],
  },
];

const axios = require('axios');

const FALLBACK_EXTERNAL_USERS = [
  {
    id: 101,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets"
    },
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874"
    }
  },
  {
    id: 102,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable supply-chains"
    },
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771"
    }
  },
  {
    id: 103,
    name: "Clementine Bauch",
    username: "Samantha",
    email: "Nathan@yesenia.net",
    phone: "1-463-123-4447",
    website: "ramiro.info",
    company: {
      name: "Romaguera-Jacobson",
      catchPhrase: "Face to face bifurcated interface",
      bs: "e-enable innovative applications"
    },
    address: {
      street: "Douglas Extension",
      suite: "Suite 847",
      city: "McKenziehaven",
      zipcode: "59590-4157"
    }
  },
  {
    id: 104,
    name: "Patricia Lebsack",
    username: "Karianne",
    email: "Julianne.OConner@kory.org",
    phone: "493-170-9623 x156",
    website: "kale.biz",
    company: {
      name: "Robel-Corkery",
      catchPhrase: "Multi-tiered zero tolerance productivity",
      bs: "transition cutting-edge web services"
    },
    address: {
      street: "Hoeger Mall",
      suite: "Apt. 692",
      city: "South Elvis",
      zipcode: "53919-4257"
    }
  },
  {
    id: 105,
    name: "Chelsey Dietrich",
    username: "Kamren",
    email: "Lucio_Hettinger@annie.ca",
    phone: "(254)954-1289",
    website: "demarco.info",
    company: {
      name: "Keebler LLC",
      catchPhrase: "User-centric fault-tolerant solution",
      bs: "revolutionize end-to-end systems"
    },
    address: {
      street: "Skiles Walks",
      suite: "Suite 351",
      city: "Roscoeview",
      zipcode: "33263"
    }
  }
];

class ExternalService {
  async fetchExternalUsers() {
    const targetUrl = 'https://jsonplaceholder.typicode.com/users';
    let rawData = [];
    let isFallback = false;
    let errorDetail = null;

    try {
      const response = await axios.get(targetUrl, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TaskManagementDashboard/1.0'
        }
      });
      rawData = response.data;
    } catch (err) {
      console.warn(`[External API Warning]: Failed to fetch from ${targetUrl} (${err.message}). Using resilient fallback dataset.`);
      rawData = FALLBACK_EXTERNAL_USERS;
      isFallback = true;
      errorDetail = err.message;
    }

    // Transform and enrich data for enterprise directory display
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Customer Success', 'Operations'];
    const statuses = ['Active', 'In Meeting', 'On Leave', 'Available'];

    const formattedUsers = rawData.map((user, index) => {
      const department = departments[index % departments.length];
      const status = statuses[index % statuses.length];
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        companyName: user.company?.name || 'Enterprise Corp',
        companyCatchPhrase: user.company?.catchPhrase || 'Driving innovation',
        addressCity: user.address?.city || 'San Francisco',
        addressStreet: user.address?.street || '',
        department,
        status,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username || user.name)}`
      };
    });

    return {
      success: true,
      count: formattedUsers.length,
      source: isFallback ? 'fallback_cache' : 'live_api',
      warning: isFallback ? `External API unreachable (${errorDetail}). Showing cached directory.` : null,
      data: formattedUsers
    };
  }
}

module.exports = new ExternalService();

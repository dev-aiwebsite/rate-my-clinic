type Products = {
    [key: string]: Product;
  };

  export interface Product {
    name: string;
    monthly: {
      id: string;
      link: string;
      price: number;
      description: string;
      included: string[];
    };
    annually: {
      id: string;
      link: string;
      price: number;
      description: string;
      included: string[];
    };
  }

export const products:Products = {
    basic : {
        name: 'Basic',
        monthly: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 10,
            description: 'Basic subscription',
            included: ['Realtime dashboard']
        },
        annually: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 100,
            description: 'Basic subscription',
            included: ['Realtime dashboard', 'support  calls']
        }
    },
    standard : {
        name: 'Standard',
        monthly: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 20,
            description: 'standard subscription',
            included: ['Realtime dashboard']
        },
        annually: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 200,
            description: 'standard subscription',
            included: ['Realtime dashboard', 'support  calls']
        }
    },
    premium : {
        name: 'Premium',
        monthly: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 30,
            description: 'Basic subscription',
            included: ['Realtime dashboard']
        },
        annually: {
            id: 'price_1PGiQ8A60aLPUECGFZe6pzRK',
            link: 'https://buy.stripe.com/test_7sI3cgeaB4R26xG001',
            price: 300,
            description: 'Basic subscription',
            included: ['Realtime dashboard', 'support  calls']
        }
    },
    

}
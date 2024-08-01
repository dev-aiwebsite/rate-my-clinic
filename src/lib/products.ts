import { metadata } from './../app/layout';

export type Product = {
    subscription: string;
    name: string;
    description: string;
    marketing_features: {name:string}[];
    prices: {[key: string]: any}[];
    metadata: {
        app_name: string;
        name: string;
        subscription_level: string;
    };
}

export const Plans:Product[] = [
    {
        subscription: '0',
        name: "Free",
        description: "Gain insight based on two data points.",
        marketing_features: [{name:'Limited Assessment'}],
        prices: [
            {
                unit_amount: 0,
            }
        ],
        metadata: {
            "app_name": "rmc",
            "name": "Free",
            "subscription_level": "0"
        }
    },
]
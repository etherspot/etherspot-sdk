export class MarketDetails {
    id: string;

    symbol: string;

    name: string;

    image?: string;

    marketCap: number;

    allTimeHigh?: number;

    allTimeLow?: number;

    fullyDilutedValuation: number;

    priceChangePercentage1h: number;

    priceChangePercentage24h: number;

    priceChangePercentage7d: number;

    priceChangePercentage1m: number;

    priceChangePercentage1y?: number;
}
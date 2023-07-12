export class MarketDetails {
    id: string;

    symbol: string;

    name: string;

    image?: string;

    marketCap: number;

    allTimeHigh?: number;

    allTimeHighTimestamp?: string;

    allTimeLow?: number;

    allTimeLowTimestamp?: string;

    fullyDilutedValuation: number;

    priceChangePercentage1h: number;

    priceChangePercentage24h: number;

    priceChangePercentage7d: number;

    priceChangePercentage1m: number;

    priceChangePercentage1y?: number;
}

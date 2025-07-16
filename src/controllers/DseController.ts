import { JsonController, Get, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { StockDataService } from "../services/DsePriceService"; // Adjust the path as necessary
import { apiResponse } from "../utils/helpers";

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: array
 *           description: The response data
 *         message:
 *           type: string
 *           description: Response message
 *     StockData:
 *       type: object
 *       properties:
 *         TRADING CODE:
 *           type: string
 *           description: Stock trading code
 *         LTP*:
 *           type: string
 *           description: Last traded price
 *         HIGH:
 *           type: string
 *           description: Highest price of the day
 *         LOW:
 *           type: string
 *           description: Lowest price of the day
 *         CLOSEP*:
 *           type: string
 *           description: Closing price
 *         YCP*:
 *           type: string
 *           description: Yesterday's closing price
 *         CHANGE:
 *           type: string
 *           description: Price change from previous day
 *         TRADE:
 *           type: string
 *           description: Number of trades
 *         VALUE (mn):
 *           type: string
 *           description: Trading value in millions
 *         VOLUME:
 *           type: string
 *           description: Trading volume
 */

@JsonController("/v1/dse")
@Service()
export class PriceController {
  constructor(private stockDataService: StockDataService) {}

  /**
   * @swagger
   * /v1/dse/hello:
   *   get:
   *     tags:
   *       - Test
   *     summary: Test endpoint
   *     description: Returns a hello world message
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Hello World"
   */
  @Get("/hello")
  getHello() {
    return { message: "Hello World" };
  }

  /**
   * @swagger
   * /v1/dse/latest:
   *   get:
   *     tags:
   *       - Stock Data
   *     summary: Get latest stock data
   *     description: Retrieves the latest stock market data from DSE
   *     responses:
   *       200:
   *         description: Latest stock data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Internal server error
   */
  @Get("/latest")
  async getStockData() {
    return apiResponse(await this.stockDataService.getStockData());
  }

  /**
   * @swagger
   * /v1/dse/dsexdata:
   *   get:
   *     tags:
   *       - Stock Data
   *     summary: Get DSEX data
   *     description: Fetches DSEX (Dhaka Stock Exchange) data with optional symbol filter
   *     parameters:
   *       - in: query
   *         name: symbol
   *         schema:
   *           type: string
   *         description: Stock symbol to filter by (optional)
   *         example: "ABBANK"
   *     responses:
   *       200:
   *         description: DSEX data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Internal server error
   */
  @Get("/dsexdata")
  async getDsexData(@QueryParam("symbol") symbol?: string) {
    return apiResponse(await this.stockDataService.getDsexData(symbol));
  }

  /**
   * @swagger
   * /v1/dse/top30:
   *   get:
   *     tags:
   *       - Stock Data
   *     summary: Get top 30 stocks
   *     description: Retrieves the top 30 stock market data from DSE
   *     responses:
   *       200:
   *         description: Top 30 stock data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Internal server error
   */
  @Get("/top30")
  async getTop30() {
    return apiResponse(await this.stockDataService.getTop30());
  }

  /**
   * @swagger
   * /v1/dse/historical:
   *   get:
   *     tags:
   *       - Stock Data
   *     summary: Get historical stock data
   *     description: Retrieves historical stock data for a specified date range and instrument
   *     parameters:
   *       - in: query
   *         name: start
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for historical data (YYYY-MM-DD)
   *         example: "2024-01-01"
   *       - in: query
   *         name: end
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for historical data (YYYY-MM-DD)
   *         example: "2024-01-31"
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *           default: "All Instrument"
   *         description: Instrument code to filter by
   *         example: "ABBANK"
   *     responses:
   *       200:
   *         description: Historical data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Missing required parameters
   *       500:
   *         description: Internal server error
   */
  @Get("/historical")
  async getHistData(
    @QueryParam("start") start: string,
    @QueryParam("end") end: string,
    @QueryParam("code") code: string = "All Instrument"
  ) {
    return apiResponse(
      await this.stockDataService.getHistData(start, end, code)
    );
  }
}

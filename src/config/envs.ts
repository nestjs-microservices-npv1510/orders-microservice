import * as joi from 'joi';
import { config } from 'dotenv';
import { PRODUCT_MICROSERVICE_NAME } from './services';
config();

interface EnvVars {
  PORT: number;

  // Product microservice
  PRODUCT_MICROSERVICE_HOST: string;
  PRODUCT_MICROSERVICE_PORT: number;
  // DATABASE_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    PRODUCT_MICROSERVICE_HOST: joi.string().required(),
    PRODUCT_MICROSERVICE_PORT: joi.number().required(),
    // DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  product_microservice_host: envVars.PRODUCT_MICROSERVICE_HOST,
  product_microservice_port: envVars.PRODUCT_MICROSERVICE_PORT,
};

import * as crypto from 'crypto';
import { Request } from 'express';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method } = req;

  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const ip = xRealIp || xForwardedFor || cIp;

  return {
    url,
    host: headers.host,
    ip,
    method,
    query,
  };
};

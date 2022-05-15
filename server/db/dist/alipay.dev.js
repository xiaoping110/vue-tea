"use strict";

var AlipaySdk = require("alipay-sdk")["default"];

var alipaySdk = new AlipaySdk({
  appId: "2021000119694637",
  gateway: "https://openapi.alipaydev.com/gateway.do",
  signType: "RSA2",
  alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAll3RTjmcMxBQTIMHaqh7xxmP3DhGxLx3s+LiXJqnLFR0mTegIHeLb5cS3Dsu++43fITZQnxjCIJ2gk9+0eomNeTV7RuomUEQS8pJz71U7sSsKfNb5TIdwIDWRxcjrT3mZ0/VawaLGzaqLLASoZeY99G5X+3JSxfCT/aPLVmf992p2L5Tsu5eN2SnzPfduYLQcr47US3iBnFWDDOVLMeIhG/47a7eATmMdH9aGlTJKPCybqnGLDCS2tn0/hF5dS5hyWRZ2Keert/PY3PgKsuzVCbZRvpgbT3cCkqbhp1BsyqtDyL0tKJTuy8X1JNKsCATaYDToPG02c0PCVtc7pVlGQIDAQAB",
  privateKey: "MIIEogIBAAKCAQEAzhoLCxeWG4xDNf1HmlFuIEyHHbXr6AiGA1mQFZTMKu9ZhWlGGAgEy04z8rW0//F7jOsFOysWmLPliNoXgQW1rkeZlflXtBMg5b/+y+H13ae8dLGm2v8e3QIz+/g2y9Ap9GOZGBraPlm0T9NXlEW00BL2MA/to8widnfOpK4WRJxvQYBjz2/2AQD+3jqQVrA8nyllxeWEcOjokQXkrWcPX4HAtlu7IZQYnGRPRPQatERJKEudc5evQBlTrg/4dPI0fPruBrZn/JpRgVRnOjJtSlzoaCTh5V23zieTbK6qg39zQp7SkqnaiexuQx8hA+Iu6RTzf0esNWWLAIalIuNjJQIDAQABAoIBADz4v2Ocqq+jow6Jy3D/vhCYEzDa7NtMCjlbeaCo0G2zOUyahD3/wUtT61JWJyHAkshxjq6eZKTwM2t0+ZcV1VWloO4ZQbToI8dUMVCnnFDimoH7PF11M/A2AqL8H1nUT1UZUeUrrHzdlNY4s6QNqxwTP/mf/LGEZn2dm+hkB/prtJ/R9bEXXfMU7rGjkQ34LcgRjT/m/mvga2jLVkPot+b9Zkz5rupyvu8M7lE8cVTsREmQmpuqZ2pPSdtg1lJQZDchP4wTN9bBMTchcNT0cNJsWkTleOsV6rasNx4KGYgf9zdB5W2e9EaVHMNrMQQEogQt2byz/IJ/i479k1V1VVECgYEA+sPDTjgBPRg7JaUiK3Cc+4jgRTM6m7QwWirvSVUVeEZLEyIdUO7WZ5iwA20k5UW0RtzKe1s0qIoMXeWIHbEEOMaKQ6x0aMWHM28NBD6neP+dtvfbspXm7JeNLJZLYimHnnWzAuV5gLHwXnKY6YdikXdQc+7eokLCYnIWoBEmslcCgYEA0meTE1U9Z5fEgTKEKAjCV9j5kZSQ1w8GGY2qB3g7rIuzrUice1yaLkVNwxLExSBtImILj+WC8HdSdscsuWWQaZOdaw+ymibYtAMja1lGUpV3Wp5l1wwWAsSj1Qj4OtqbyAd6xouyyCgJHbK8jxDj4tWKAWfFnA6ul6XtAUd+wOMCgYBiA8KDAED7sEzuGe2RLSMu7gE7CxsNYRDFLaL59te9ezw87kinKbOEKpohvLd/Jg+g4wwBy1R5y/upd94MPPR5fKDucqnNieeeovljf1nWYZMzwQ2OcCkisNntY5FzfOgVd8vQhgFH3EUnpYM/RDuywAAiUGuU4KM5934AcrO9YQKBgDKPy0s5D7GGSiWWAyYvvKwpqweuAQR9SsT3QyXaYdS8GaiJq3kFrtNxuhcnunt4qGE72HVy/P1WX03F3VyMKKEGZSzmL9BVh3vyyR8x6/FKk80GBYkhEWUG5iv6pNRX1lnCWmG+Dm+FF3O4kRF8SJcpI6nkyxsOeCxfJk5JZQ9rAoGAXA+GcU7vLzGQq6AidwRuehlKmkSaZwqC4SZvcd55MhDU6A806tzSwD3pJ/H5/h2sBFCPWJDSien8m2MaG3Q0iSxHtpMfaUJ5MZc8Vf+0mbp42l0zbTcgjWDT9Tw6HQu53cDTJSrihB4yDPGdkYWqFeX00aWMOOmUBvgYoJ65X+U="
});
module.exports = alipaySdk;
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const COGNITO_USER_POOL_ID = "us-east-1_unZWrpzVR";
const COGNITO_REGION = "us-east-1";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

exports.handler = async (event) => {
  const token = event.authorizationToken || (event.headers && event.headers.Authorization);
  if (!token) {
    return generatePolicy('user', 'Deny', event.methodArn);
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`
      }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
    return generatePolicy(decoded.sub, 'Allow', event.methodArn);
  } catch (err) {
    console.error('JWT validation error:', err);
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

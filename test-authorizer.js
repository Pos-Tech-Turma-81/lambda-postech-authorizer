const { handler } = require('./app/src/index');

const jwtToken = "eyJraWQiOiI0bjlqYXFJcmtEZDMxZVVcL285Q21Wek9iczBDOUNkbUg2UFpkejlocG5URT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2a3ZiMjFjb2MxYWQ2c2x0cWJva2I0bjFtdSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLTBoZ2phaVwvcmVhZCIsImF1dGhfdGltZSI6MTc1OTI1NTAzOSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfZ1JndjBPaDJjIiwiZXhwIjoxNzU5MjU4NjM5LCJpYXQiOjE3NTkyNTUwMzksInZlcnNpb24iOjIsImp0aSI6ImMwYjQwNzNjLWMzNzItNGQzMi1iMzkzLWRhMWFkZTQxM2U5MSIsImNsaWVudF9pZCI6IjZrdmIyMWNvYzFhZDZzbHRxYm9rYjRuMW11In0.VMEcAhJCJ0_tt1rL2-0SYKZnas61VhldItBLeJkFo-NPZX0QKbHIOp6y5D8nqv8IId_XgrzmjXJutIhEOqA1stoQxg9O-9w0PKQek0ZxWbMm2TnOo9WQkHqtprHTE4pGqNvCiL4btelvUnK2Rn8kMDpMDgnLPFhfS0yBhaU2t_R70aNgOk7QIwIU6dqTzo8EWizdklQZhwCdz5w5di2f-KQJ1-nW1qiGDE5iHGqDM-d4dFn23LX8XwEullgk3G-AwM4cEPIkqaVLAyk7YorEwGFnWQJ3o1uYKZZ-uXiBEZHuoXXbnrnxTfPdQRTxjChHhyG8KL2Z1UE_dVzGO1z86Q";

const event = {
  type: "TOKEN",
  authorizationToken: jwtToken,
  methodArn: "arn:aws:execute-api:us-east-1:123456789012:example/prod/GET/resource"
};

handler(event)
  .then(result => {
    console.log("Resultado da Lambda Authorizer:", result);
  })
  .catch(error => {
    console.error("Erro na Lambda Authorizer:", error);
  });

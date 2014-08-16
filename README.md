dockerode-optionator
====================

normalize docker-related environment variables for dockerode's connection object

```
  #normalizeOptions()
    passing in nothing
      ✓ defaults to default socket path (/var/run/docker.sock) 
    using environment variables DOCKER_IP and DOCKER_PORT
      ✓ returns expected dockerode connection structure 
    using environment variable DOCKER_HOST
      ✓ understands http://127.0.0.1:4243 
      ✓ understands unix:///var/run/docker.sock 
      ✓ understands /var/run/docker.sock 
      ✓ understands tcp://127.0.0.1:4243 


  6 passing (9ms)
```

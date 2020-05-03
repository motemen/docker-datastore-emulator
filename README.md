# datastore-emulator

A simple Docker image which launches Cloud Datastore emulator, built upon [google/cloud-sdk](https://hub.docker.com/r/google/cloud-sdk).

## Usage

	docker run -it --rm -e CLOUDSDK_CORE_PROJECT=test-project -p 8081:8081 motemen/datastore-emulator

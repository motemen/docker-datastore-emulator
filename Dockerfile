FROM google/cloud-sdk:290.0.1

# use with -e CLOUDSDK_CORE_PROJECT=...,

EXPOSE 8081

CMD ["gcloud", "beta", "emulators", "datastore", "start", "--host-port=0.0.0.0:8081"]

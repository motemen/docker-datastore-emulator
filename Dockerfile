FROM google/cloud-sdk:287.0.0

# use with -e CLOUDSDK_CORE_PROJECT=...,

CMD ["gcloud", "beta", "emulators", "datastore", "start"]

FROM google/cloud-sdk:284.0.0

# use with -e CLOUDSDK_CORE_PROJECT=...,

CMD ["gcloud", "beta", "emulators", "datastore", "start"]

terraform{
    required_providers {
      google = {
        source = "hashicorp/google"
        version = "~> 4.60"
      }
    }
}

provider "google"{
    project = "proyectoayd-439803"
    region = "us-central1"
    credentials = file("./key.json")
}
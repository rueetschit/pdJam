variable "stage" {
  default = "DEV"
}

variable "prefix" {
  default = "pdjam"
}

variable "default_tags" {
  default = {
    environment = "dev"
    autodeploy  = true
  }
}

variable vm {
  default = {
    credentials = {
      username = null
      password = null
    }
  }
}
terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "pdjam"

    workspaces {
      name = "pdjam-dev"
    }
  }
}

provider "azurerm" {
  version = "1.35.0"
}

locals {
  stagedname = lower("${var.prefix}-${var.stage}")
  location = "westeurope"
}

resource "azurerm_resource_group" "rg" {
  name = "PDJAM"
  location = local.location
}

resource "azurerm_storage_account" "storage_account" {
  name = "pdjamstorage"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location
  account_tier = "Standard"
  account_kind = "StorageV2"
  account_replication_type = "LRS"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${local.stagedname}-vnet"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "subnet" {
  name                 = "${local.stagedname}-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefix       = "10.0.1.0/24"
}

resource "azurerm_public_ip" "vm_public_ip" {
  name                = "${local.stagedname}-vm-public-ip"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Dynamic"
  domain_name_label   = "${local.stagedname}-vm"
}

resource "azurerm_network_security_group" "vm_nsg" {
  name                = "${local.stagedname}-vm-nsg"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "AllowInboundWebapp"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowInboundIceCast"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowInboundPdjamServer"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "vm_netwok_interface" {
  name                = "${local.stagedname}-vm-network-interface"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "${local.stagedname}-vm-ipconfig"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.vm_public_ip.id
  }

  network_security_group_id = azurerm_network_security_group.vm_nsg.id
}

resource "azurerm_virtual_machine" "vm" {
  name="${local.stagedname}-vm"
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name
  vm_size = "Standard_B2s" # see https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/
  network_interface_ids = [azurerm_network_interface.vm_netwok_interface.id]

  delete_data_disks_on_termination = false
  delete_os_disk_on_termination    = true

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
  storage_os_disk {
    name              = "${local.stagedname}-vm-disk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Premium_LRS"
  }

  os_profile {
    computer_name  = "${local.stagedname}-vm"
    admin_username = var.vm.credentials.username
    admin_password = var.vm.credentials.password

    custom_data    = templatefile("${path.module}/cloud-init.tmpl", {
      vm_username = var.vm.credentials.username
    })
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }

  # necessary for serial console
  boot_diagnostics {
    enabled     = true
    storage_uri = azurerm_storage_account.storage_account.primary_blob_endpoint
  }
}
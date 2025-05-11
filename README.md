# geoip
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A lightweight Node.js project for GeoIP lookup using the GeoLite2 City database. This project leverages TypeScript for type safety and modern JavaScript practices, offering a clean and efficient way to retrieve geographic information based on IP addresses.

## Overview

The **geoip** project is designed to be deployed directly to **Azure Functions using GitHub Actions**. It provides a set of functions to resolve geographic data from IP addresses. The project utilizes the [GeoLite2-City](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) database, ensuring fast and reliable lookups. The codebase is structured for clarity and modularity, making it suitable for both production use and educational purposes.

## Features

- **Seamless Deployment**: Uses GitHub Actions to automatically deploy to Azure Functions.
- **IP Geolocation**: Retrieve city-level data based on IP addresses.
- **TypeScript**: Fully typed codebase to reduce runtime errors and improve developer experience.
- **Lightweight & Efficient**: Designed to be easy-to-use and integrate into other applications or services.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/geoip.git
   cd geoip
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MaxMind License Key:**

   The GeoLite2 database requires a MaxMind License Key to download. Follow these steps to configure it:

   - Create a free account on [MaxMind](https://www.maxmind.com/en/geolite2/signup)
   - Generate a license key under **My Account > License Keys**
   - Store the license key in GitHub Secrets:
     1. Navigate to your repository on GitHub.
     2. Go to **Settings > Security > Secrets and variables > Actions**.
     3. Click **New repository secret**.
     4. Set the name to `MAXMIND_LICENSE_KEY`.
     5. Paste your license key as the value and save it.

4. **Ensure the GeoLite2 database is present:**

   The database file will be downloaded automatically during deployment and placed in `dist/src/data/GeoLite2-City.mmdb`.

## Required Environment Variables

To securely deploy the project using GitHub Actions and OIDC authentication, set the following secrets in GitHub:

| Secret Name             | Description |
|-------------------------|-------------|
| `AZURE_RESOURCE_GROUP`  | The name of the Azure resource group where the function app is deployed |
| `AZURE_FUNCTIONAPP_NAME` | The name of the Azure Function App |
| `AZURE_CLIENT_ID`       | The application (client) ID for OIDC authentication |
| `AZURE_TENANT_ID`       | The Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | The Azure subscription ID |
| `MAXMIND_LICENSE_KEY`   | The license key required to download the GeoLite2 database |

### **Setting Up MaxMind License Key**

The GeoLite2 database requires a MaxMind License Key to download automatically during deployment. Follow these steps to configure it:

1. **Create a free account on [MaxMind](https://www.maxmind.com/en/geolite2/signup)**
2. **Generate a license key** under **My Account > License Keys**
3. **Store the license key in GitHub Secrets:**
   - Navigate to your repository on GitHub.
   - Go to **Settings > Security > Secrets and variables > Actions**.
   - Click **New repository secret**.
   - Set the name to `MAXMIND_LICENSE_KEY`.
   - Paste your license key as the value and save it.

### Setting Up Azure OIDC Authentication

#### **Option 1: Using Azure Portal**

1. **Go to Azure Portal** ([portal.azure.com](https://portal.azure.com))
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Open **App registrations** > **New registration**
   - Name: `GitHub Actions OIDC`
   - Supported account types: **Single tenant**
   - Click **Register**

4. Go to **Certificates & secrets** > **Federated credentials** > **Add credential**
   - Issuer: `https://token.actions.githubusercontent.com`
   - Subject identifier: `repo:your-username/geoip:ref:refs/heads/main`
   - Audience: `api://AzureADTokenExchange`

5. Copy the **Application (client) ID** and **Tenant ID** for later use.

6. Assign the necessary role to your Function App’s resource group:
   - Navigate to the **Resource Group** where your function app is deployed.
   - Open **Access control (IAM)** > **Add role assignment**.
   - Role: **Contributor**
   - Assign access to: **User, group, or service principal**
   - Select the application registered in Step 3.

#### **Option 2: Using Azure CLI**

```sh
# Login to Azure
az login

# Create an OIDC-enabled service principal
az ad sp create-for-rbac --name "GitHubActionsOIDC" --role Contributor   --scopes /subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>

# Retrieve IDs needed for GitHub Secrets
az ad sp list --display-name "GitHubActionsOIDC" --query "[].appId" -o tsv  # Client ID
az account show --query tenantId -o tsv  # Tenant ID
```

## Deployment via GitHub Actions

After configuring OIDC authentication, GitHub Actions will securely deploy the project to Azure Functions.

## Project Structure

```
geoip/
├── .funcignore
├── .gitignore
├── host.json
├── package-lock.json
├── package.json
├── tsconfig.json
└── src
    ├── index.ts
    ├── data
    │   └── (GeoLite2-City.mmdb)   # This file is automatically downloaded during deployment. You need to download this file from MaxMind for local testing.
    └── functions
        └── geoip.ts
```

## Contributing

Contributions are welcome. Please follow standard GitHub workflow:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Contact

For further information, issues, or feature requests, please open an issue on GitHub.

---

Crafted with attention to modern development practices and designed for efficiency.

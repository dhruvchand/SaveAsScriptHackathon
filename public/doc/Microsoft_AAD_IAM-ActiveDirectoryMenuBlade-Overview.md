---
portalUri: "https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview"
---

# Azure Active Directory Overview
## Organization
* [GET /organization](https://docs.microsoft.com/graph/api/organization-get)
* [Get-MgOrganization](https://docs.microsoft.com/powershell/module/microsoft.graph.identity.directorymanagement/get-mgorganization)

## Secure Score
* [GET /security/secureScoreControlProfiles]()
* [Get-MgSecuritySecureScoreControlProfile]()

```powershell
Import-Module Microsoft.Graph.Security

Get-MgSecuritySecureScoreControlProfile -Filter "controlCategory eq 'Identity'" -Top 999 -Property "id,maxScore,deprecated" 
```

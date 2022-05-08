---
portalUri: "https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview"
---
# Azure Active Directory Overview

## Organization

* [GET /organization](https://docs.microsoft.com/graph/api/organization-get)
* [Get-MgOrganization](https://docs.microsoft.com/powershell/module/microsoft.graph.identity.directorymanagement/get-mgorganization)

## Count directory objects

* [GET /groups/$count](https://docs.microsoft.com/en-au/graph/api/group-list?view=graph-rest-beta&tabs=http)
* [Get-MgGroup](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.groups/get-mggroup?view=graph-powershell-beta)
* [GET /users/$count](https://docs.microsoft.com/en-au/graph/api/user-list?view=graph-rest-beta&tabs=http)
* [Get-MgUser](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.users/get-mguser?view=graph-powershell-beta)
* [GET /applications/$count](https://docs.microsoft.com/en-au/graph/api/application-list?view=graph-rest-beta&tabs=http)
* [Get-MgApplication](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.applications/get-mgapplication?view=graph-powershell-beta)
* [GET /devices/$count]
* [Get-MgDevice](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.identity.directorymanagement/get-mgdevice?view=graph-powershell-beta)

```powershell
Get-MgUser -ConsistencyLevel eventual -Count userCount | Out-Null
Get-MgGroup -ConsistencyLevel eventual -Count groupCount | Out-Null
Get-MgApplication -ConsistencyLevel eventual -Count applicationCount | Out-Null
Get-MgDevice -ConsistencyLevel eventual -Count deviceCount | Out-Null

Write-Host "Users:$userCount Groups:$groupCount Applications:$applicationCount Devices:$deviceCount"
```

## Secure Score

* [GET /security/secureScores?$top=1&$select=controlScores]()
* [Get-MgSecuritySecureScore]()
* [GET /security/secureScoreControlProfiles](https://docs.microsoft.com/graph/api/security-list-securescorecontrolprofiles)
* [Get-MgSecuritySecureScoreControlProfile](https://docs.microsoft.com/powershell/module/microsoft.graph.security/get-mgsecuritysecurescorecontrolprofile)

```powershell
Import-Module Microsoft.Graph.Security
Get-MgSecuritySecureScore -Top 1 -Property "controlScores" 
Get-MgSecuritySecureScoreControlProfile -Filter "controlCategory eq 'Identity'" -Top 999 -Property "id,maxScore,deprecated" 
```

## Roles

* [GET /roleManagement/directory/transitiveRoleAssignments?$filter=principalId eq '{principalId}'](https://docs.microsoft.com/en-us/graph/api/rbacapplication-list-transitiveroleassignments?view=graph-rest-beta&tabs=http)
* [Get-MgRoleManagementDirectoryTransitiveRoleAssignment](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.devicemanagement.enrolment/get-mgrolemanagementdirectorytransitiveroleassignment?view=graph-powershell-beta)

## Recommendations

* [GET /directory/recommendations]()
* [Get-MgDirectoryRecommendation](https://docs.microsoft.com/en-au/powershell/module/microsoft.graph.identity.directorymanagement/get-mgdirectoryrecommendation?view=graph-powershell-beta)

```powershell
Import-Module Microsoft.Graph.Identity.DirectoryManagement
Get-MgDirectoryRecommendation -Top 50 
```

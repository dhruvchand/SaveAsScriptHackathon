- List group memberships
  - Graph API: [GET /groups/{id}/memberOf](https://docs.microsoft.com/graph/api/group-list-memberof?view=graph-rest-1.0&tabs=http)
  - PowerShell: [Get-MgGroupMemberOf](https://docs.microsoft.com/powershell/module/microsoft.graph.groups/get-mggroupmemberof?view=graph-powershell-1.0)
  
- Add group memberships
  - Graph API: POST /groups/{group-id}/memberOf/$ref
  - PowerShell: [New-MgGroupMemberOfByRef](https://docs.microsoft.com/powershell/module/microsoft.graph.groups/new-mggroupmemberofbyref?view=graph-powershell-1.0)
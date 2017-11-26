angular.app('PMOapp')
    .service('logStat', logStat);

function logStat(tokenService) {
    return tokenService.getPayload(tokenService.getToken).admin;
}
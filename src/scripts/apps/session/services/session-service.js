import log from 'loglevel';
// Store this interval function in the module root, just in case we get references to multiple instances of this service.
// If that happens, there'd be multiple timers running concurrently, surely to make debugging this difficult thing to debug.
var _renewSessionTimeout = null;
export default function (sessionRepository, authService) {

  const sessionService = {
    async login(token, user, keepAliveSessionFunc){

      if (!keepAliveSessionFunc) {
        throw new Error('Missing keepAliveSessionFunc');
      }

      try {

        log.info("Beginning: Get third party auth for user: %s", user.nickname);
        const thirdPartyAuthInformation = await authService.getThirdPartyAuth(token);
        log.info("Completed: Get third party auth for user: %s", user.nickname);

        var newUserInformation = Object.assign({}, user, thirdPartyAuthInformation);
      } catch (e) {
        throw new Error("Cannot get third party auth: " + e.stack);
      }

      try {
        await sessionRepository.saveLoginInfo(token, newUserInformation);
      } catch (e) {
        throw new Error("Cannot save login info: " + e.stack);
      }

      try {
        var loginInfo = await sessionRepository.getLoginInfo();
      } catch (e) {
        throw new Error("Cannot retrieve login info after saving: " + e.stack);
      }


      if (_renewSessionTimeout) {
        clearTimeout(_renewSessionTimeout);
      }

      _renewSessionTimeout = setTimeout(keepAliveSessionFunc, 1000 * 60 * 60); // 1 hour

      return loginInfo;
    },

    async logout(){
      // prevent the auto refresh
      if (_renewSessionTimeout) {
        clearTimeout(_renewSessionTimeout);
        _renewSessionTimeout  = null;
      }

      try {
        var retVal = await sessionRepository.deleteLoginInfo();
      } catch (e) {
        throw new Error("Cannot logout: " + e.stack);
      }
      return retVal;
    },

    async renewSession(keepAliveSessionFunc){
      try {
        const loginInfo      = await sessionRepository.getLoginInfo();
        const currentIdToken = loginInfo.token;

        log.info("Beginning: Renew auth for user: %s", loginInfo.user.nickname);
        const newIdToken     = await authService.renewAuth(currentIdToken);
        log.info("Completed: Renew auth for user: %s", loginInfo.user.nickname);

        return await sessionService.login(newIdToken, loginInfo.user, keepAliveSessionFunc);

      } catch (e) {
        throw new Error("Cannot renew: " + e);
      }
    },

    async resumeSession(keepAliveSessionFunc){
      try {
        await sessionService.renewSession(keepAliveSessionFunc);
        var retVal = await sessionRepository.getLoginInfo();
      } catch (e) {
        throw new Error("Cannot resume session: " + e.stack);
      }
      return retVal;
    }
  };

  return sessionService;
};
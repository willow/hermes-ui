import {stringToTimestamp} from '../../../libs/js-utils/type/date-utils';


export default function (userRepository) {

  return {
    async subscribeUser(userId, paymentToken){
      return await userRepository.subscribeUser(userId, paymentToken);
    }
  };

}

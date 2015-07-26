import Immutable from 'immutable';

const path = "agreement";

export default function (apiService) {

  const repository = {
    async save(agreement) {
      return apiService.saveData(path, agreement);
    }
  };

  return repository;
};

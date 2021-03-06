import T from 'tcomb';

//noinspection JSUnresolvedFunction
const agreementListItem = T.struct({
  id: T.Str,
  name: T.Str,
  counterparty: T.Str,
  image: T.Str,
  status: T.Str,
  type: T.Str,
  outcomeDate: T.Str,
  modifiedDate: T.Str,
  documentCount: T.Num
});

agreementListItem._from_attrs = function (data) {
  return new this(data);
};

export default agreementListItem;

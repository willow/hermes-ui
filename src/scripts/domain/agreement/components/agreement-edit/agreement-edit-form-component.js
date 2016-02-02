'use strict';

import React from 'react';

import DependencyProvider from '../../../../libs/dependency-injection/utils/dependency-provider';

import Agreement from '../../models/agreement-list-item-model';
import Select from 'react-select';
import Validation from 'rc-form-validation';

import cx from 'classnames';

import ButtonSelect from 'src/scripts/libs/react-js/components/button-select'

import Datepicker from 'react-datepicker';

import moment from 'moment';

import {toNumber} from 'src/scripts/libs/js-utils/validation/validation-utils';
import {normalizeFormValues} from 'src/scripts/libs/js-utils/form/form-utils';

import agreementValueLabel from 'src/scripts/apps/formatting/agreement/agreement-value-label';

import formattingService from 'src/scripts/apps/formatting/services/formatting-service';

const {Validator} = Validation;

const {durationTypes, renewTypes} = agreementValueLabel;

export default function () {

  const component = React.createClass({
    displayName: "AgreementEditFormComponent",
    mixins: [Validation.FieldMixin],

    getInitialState() {
      return {
        status: {
          autoRenew: {},
          counterparty: {},
          description: {},
          durationDetails: {},
          executionDate: {},
          name: {},
          renewalNoticeAmount: {},
          renewalNoticeType: {},
          termLengthAmount: {},
          termLengthType: {}
        },
        formData: {
          autoRenew: false,
          counterparty: '',
          description: '',
          durationDetails: '',
          executionDate: null,
          name: '',
          renewalNoticeAmount: '',
          renewalNoticeType: 'day',
          termLengthAmount: '',
          termLengthType: 'year',
          typeId: null
        }
      };
    },

    componentWillReceiveProps (nextProps) {
      // reset old form data if we switch from one agreement to another
      this._setFormData(Object.assign({}, this.getInitialState().formData, nextProps.agreement));
    },

    _setFormData(val){
      this.setState({formData: Object.assign({}, this.state.formData, val)});
    },

    onChangeAgreementType (newVal){
      let typeId = null;

      if (newVal) {
        typeId = newVal.value;
      }

      this._setFormData({typeId: typeId});
    },

    onChangeExecutionDate (newVal){
      this._setFormData({executionDate: newVal.toString()});
    },

    onChangeTermLengthType (newVal){
      this._setFormData({termLengthType: newVal});
    },

    onChangeAutoRenew (newVal){
      this._setFormData({autoRenew: newVal});
    },

    onChangeRenewalNoticeType (newVal){
      this._setFormData({renewalNoticeType: newVal});
    },

    onSubmit(event){
      event.preventDefault();
      var validation = this.refs.validation;

      // it's important to remember that validation is async (consider database calls, apis, existence in db, etc).
      validation.validate(valid => {

        if (valid) {
          const formData = normalizeFormValues(this.state.formData);
          this.props.onValid(formData);
        }
        else {
          this.props.onInvalid();
        }
      });
    },

    render() {
      var agreementTypesValues = [];
      const userAgreementTypes = this.props.agreementTypes;
      if (userAgreementTypes) {
        agreementTypesValues = formattingService.getValueLabelFromArray(userAgreementTypes);
      }

      const formData = this.state.formData;
      const status   = this.state.status;

      let executionDate = formData.executionDate;
      if (executionDate) {
        executionDate = moment(executionDate);
      }
      else {
        executionDate = moment();
      }

      const defaultFormClasses       = ['form-group'];
      const nameFormClasses          = cx(defaultFormClasses, {'has-error': status.name.errors});
      const counterpartyFormClasses  = cx(defaultFormClasses, {'has-error': status.counterparty.errors});
      const executionDateFormClasses = cx(defaultFormClasses, {'has-error': status.executionDate.errors});
      const termLengthFormClasses    = cx(defaultFormClasses, {'has-error': status.termLengthAmount.errors});
      const renewalNoticeFormClasses = cx(defaultFormClasses, {'has-error': status.renewalNoticeAmount.errors});

      return (
        <div className="agreement-edit-form-wrapper">
          <form className="form-horizontal" onSubmit={this.onSubmit}>
            <Validation ref='validation' onValidate={this.handleValidate}>
              <section className="row content-section-item space-bottom-xl">
                <div className="space-top-sm col-md-24">
                  <h3 className="content-section-header">General Agreement Information</h3>

                  <div className={nameFormClasses}>
                    <label htmlFor="agreement-form-name" className="col-sm-6 control-label">Agreement
                      Name</label>

                    <div className="col-sm-18">
                      <Validator rules={{required:true, message: 'Name is required'}}>
                        <input autoFocus type="text" name="name" className="form-control"
                               id="agreement-form-name"
                               value={formData.name}/>
                      </Validator>
                      {status.name.errors ?
                        <div className="help-block">{status.name.errors.join(', ')}</div> : null}
                    </div>
                  </div>

                  <div className={counterpartyFormClasses}>
                    <label htmlFor="agreement-form-counterparty"
                           className="col-sm-6 control-label">Counterparty</label>

                    <div className="col-sm-18">
                      <Validator rules={{required:true, message: 'Counterparty is required'}}>
                        <input type="text" className="form-control" id="agreement-form-counterparty"
                               name="counterparty" value={formData.counterparty}/>
                      </Validator>
                      {status.counterparty.errors ?
                        <div className="help-block">{status.counterparty.errors.join(', ')}</div> : null}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-6 control-label">Agreement Type</label>

                    <div className="col-sm-18">
                      <Select placeholder={null} options={agreementTypesValues} allowCreate
                              value={formData.typeId}
                              onChange={this.onChangeAgreementType}/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="agreement-form-description" className="col-sm-6 control-label">Brief
                      Description</label>

                    <div className="col-sm-18">
                      <Validator rules={{required:false}}>
                            <textarea rows="5" className="form-control" id="agreement-form-description"
                                      name="description" value={formData.description}/>
                      </Validator>
                    </div>
                  </div>

                </div>

              </section>
              <section className="row agreement-form-section content-section-item space-top-sm space-bottom-xl">
                <div className="col-md-24">
                  <h3 className="content-section-header">Agreement Duration and Renewal Information</h3>

                  <div className={executionDateFormClasses}>
                    <label htmlFor="agreement-form-execution-date" className="col-sm-6 control-label">Execution
                      Date</label>

                    <div className="col-sm-6">
                      <Datepicker className='form-control' selected={executionDate}
                                  onChange={this.onChangeExecutionDate}/>
                      {/*<Validator
                       rules={{required:true, message: 'Execution date is required'}}>
                       <input type="date" className="form-control" name="executionDate"
                       id="agreement-form-execution-date"
                       value={formData.executionDate}/>
                       </Validator>*/}
                    </div>
                    <div className="row">
                      <div className="col-sm-offset-6 col-sm-18">
                        {status.executionDate.errors ?
                          <div className="help-block">{status.executionDate.errors.join(', ')}</div> : null}</div>
                    </div>
                  </div>

                  <div className={termLengthFormClasses}>
                    <label htmlFor="agreement-form-d-length-amount" className="col-sm-6 control-label">Initial
                      Term
                      Length</label>

                    <div className="col-sm-3">
                      <Validator
                        rules={{required:false, type:'number', transform:toNumber, message: 'Term length must be a number'}}>
                        <input type="text" className="form-control" name="termLengthAmount"
                               id="agreement-form-term-length-amount"
                               value={formData.termLengthAmount}/>
                      </Validator>
                    </div>
                    <div className="col-sm-6">
                      <ButtonSelect items={durationTypes} value={formData.termLengthType}
                                    onChange={this.onChangeTermLengthType}
                                    className="btn btn-sm btn-info agreement-form-button agreement-form-field-button"/>
                    </div>
                    <div className="row">
                      <div className="col-sm-offset-6 col-sm-18">
                        {status.termLengthAmount.errors ?
                          <div
                            className="help-block">{status.termLengthAmount.errors.join(', ')}</div> : null}</div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-6 control-label">Auto-Renew?</label>

                    <div className="col-sm-6">
                      <ButtonSelect items={renewTypes} value={formData.autoRenew}
                                    onChange={this.onChangeAutoRenew}
                                    className="btn btn-sm btn-info agreement-form-button agreement-form-field-button"/>
                    </div>
                  </div>
                  <div className={renewalNoticeFormClasses}>
                    <label htmlFor="agreement-form-renewal-notice-amount" className="col-sm-6 control-label">Renewal
                      Notice</label>

                    <div className="col-sm-3">
                      <Validator
                        rules={{required:false,type:'number', transform:toNumber, message: 'Renewal notice must be a number'}}>
                        <input type="text" className="form-control" id="agreement-form-renewal-notice-amount"
                               name="renewalNoticeAmount" value={formData.renewalNoticeAmount}/>
                      </Validator>
                    </div>
                    <div className="col-sm-10">
                      <ButtonSelect items={durationTypes} value={formData.renewalNoticeType}
                                    onChange={this.onChangeRenewalNoticeType}
                                    className="btn btn-sm btn-info agreement-form-button agreement-form-field-button"/>
                        <span
                          className="control-label content-section-item space-left-sm space-right-sm agreement-form-control-text">before
                        </span>
                      <ButtonSelect items={[{label:"Expiration",value:'expiration'}]} value='expiration'
                                    className="btn btn-sm btn-info agreement-form-button agreement-form-field-button"/>
                    </div>
                    <div className="row">
                      <div className="col-sm-offset-6 col-sm-18">
                        {status.renewalNoticeAmount.errors ?
                          <div
                            className="help-block">{status.renewalNoticeAmount.errors.join(', ')}</div> : null}</div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="agreement-form-durations-details" className="col-sm-6 control-label">Other
                      Details</label>

                    <div className="col-sm-18">
                      <Validator rules={{required:false}}>
                              <textarea rows="5" className="form-control" id="agreement-form-durations-details"
                                        name="durationDetails" value={formData.durationDetails}/>
                      </Validator>
                    </div>
                  </div>

                </div>
              </section>
              <section className="row agreement-form-section agreement-form-section-save content-section-item">
                <div className="col-md-24">
                  <button type='submit' className="btn btn-primary">Save and Close
                  </button>
                </div>
              </section>
            </Validation>
          </form>
        </div>
      );
    }
  });

  return new DependencyProvider(component);
};
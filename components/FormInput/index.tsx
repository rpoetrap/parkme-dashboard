import { FunctionComponent, Dispatch, SetStateAction, useCallback } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import SelectAsync from 'react-select/async';
import Switch from 'react-switch';
import cx from 'classnames';
import attr from 'attr-accept';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX } from 'react-icons/fi';

import styles from '../../pages/styles.module.scss';
import { InputState, Pagination } from '../../types';
import { number } from '../../utils/string';

export interface OptionType extends OptionTypeBase {
  label: string;
  value: string;
}

interface Props {
  id?: string;
  type: string;
  placeholder?: string;
  data?: OptionType[];
  setter: Dispatch<SetStateAction<InputState<any>>>;
  getter: InputState<any>;
  pagination?: Pagination;
  fetchPagination?: (pagination: Pagination) => Promise<OptionType[]>;
  accept?: string | string[];
  disabled?: boolean;
}

let reactSelectId = 1;

const FormInput: FunctionComponent<Props> = (props: Props) => {
  const { id, type, placeholder, setter, getter } = props;

  switch (type) {
    case 'file': {
      const { accept, disabled } = props;
      const { value, error, errorMessage } = getter;
      const isImage = attr(value, 'image/*');
      const clearFunction = () => setter({ value, error: false, errorMessage: '' });
      const onChange = (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
          if (acceptedFiles[0].size < 1000000) {
            setter({ value: acceptedFiles[0], error: false, errorMessage: '' });
          } else {
            setter((prev) => {
              const { value } = prev;
              return ({ value, error: true, errorMessage: 'Maximum file size is 1MB !' });
            });
          }
        }
      };

      const onDrop = useCallback(onChange, []);
      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept, disabled });

      return (
        <div className={styles['col']}>
          <div
            className={cx(styles['dropzone'], error ? styles['error'] : undefined, disabled ? 'disabled' : undefined)}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            { value ? isImage ?
                <img className={styles['temp-image']} src={URL.createObjectURL(value)} /> : (
                  <div className={styles['inner-container']}>
                    <p>{value.name}</p>
                    <FiUploadCloud />
                  </div>
                ) : (
                  <div className={styles['inner-container']}>
                    {!disabled && (
                      <>
                        {isDragActive ?
                          <p>Drop file kesini ...</p> :
                          <p>{placeholder || `Drag 'n' drop file kesini, atau klik untuk memilih file`}</p>
                        }
                        <FiUploadCloud />
                      </>
                    )}
                  </div>
                )
            }
          </div>
          <div className={styles['invalid-feedback']}>
            {errorMessage}
            <a style={{ marginLeft: '3px', cursor: 'pointer' }} onClick={() => clearFunction()}>
              <FiX />
            </a>
          </div>
        </div>
      );
    }
    case 'switch': {
      return (
        <Switch
          className={cx(styles['col'], styles['my-auto'])}
          uncheckedIcon={false}
          checkedIcon={false}
          checked={getter.value}
          onChange={(checked) => setter({ value: checked, error: false, errorMessage: '' })}
        />
      )
    }
    case 'dropdown': {
      const { data } = props;
      return (
        <div className={styles['col']}>
          <Select
            id={id ? id : `react-select-${reactSelectId++}`}
            className={getter && getter.error ? styles.invalid : undefined}
            styles={{
              input: () => ({
                boxShadow: 'none',
                'input': { boxShadow: 'none', height: 'unset' }
              }),
              control: (provided, state) => ({
                ...provided, borderColor: getter.error ? '#dc3545' : provided.borderColor,
                '&:hover': { borderColor: getter.error ? '#dc3545' : provided.borderColor },
                boxShadow: getter.error && state.isFocused ? '0 0 0 1px #dc3545' : provided.boxShadow
              })
            }}
            options={data}
            onChange={(data) => setter({ value: data, error: false, errorMessage: '' })}
            value={getter ? getter.value : undefined}
          />
          <div className={styles['invalid-feedback']}>
            {getter && getter.errorMessage}
          </div>
        </div>
      )
    }
    case 'dropdownAsync': {
      const { data, pagination, fetchPagination } = props;
      return (
        <div className={styles['col']}>
          <SelectAsync
            id={id ? id : `react-select-${reactSelectId++}`}
            className={getter && getter.error ? styles.invalid : undefined}
            styles={{
              input: () => ({
                boxShadow: 'none',
                'input': { boxShadow: 'none', height: 'unset' }
              }),
              control: (provided, state) => ({
                ...provided, borderColor: getter.error ? '#dc3545' : provided.borderColor,
                '&:hover': { borderColor: getter.error ? '#dc3545' : provided.borderColor },
                boxShadow: getter.error && state.isFocused ? '0 0 0 1px #dc3545' : provided.boxShadow
              })
            }}
            defaultOptions={data ?? true}
            loadOptions={(input) => fetchPagination!({ ...pagination!, filters: `name=@${input}` })}
            onChange={(data) => setter({ value: data, error: false, errorMessage: '' })}
            value={getter ? getter.value : undefined}
          />
          <div className={styles['invalid-feedback']}>
            {getter && getter.errorMessage}
          </div>
        </div>
      )
    }
    case 'currency': {
      const formatted = number.formatMoney(getter.value) || (getter.value as number).toString();
      return (
        <div className={styles['col']}>
          <input
            id={id ? id : undefined}
            className={getter && getter.error ? styles.invalid : undefined}
            type="text"
            placeholder={placeholder}
            value={formatted || undefined}
            onChange={(e) => setter({ value: Math.abs(number.unformat(e.target.value)), error: false, errorMessage: '' })}
          />
          <div className={styles['invalid-feedback']}>
            {getter && getter.errorMessage}
          </div>
        </div>
      )
    }
    case 'password': {
      return (
        <div className={styles['col']}>
          <input
            id={id ? id : undefined}
            className={getter && getter.error ? styles.invalid : undefined}
            type="password"
            placeholder={placeholder}
            value={getter ? getter.value : undefined}
            onChange={(e) => setter({ value: e.target.value, error: false, errorMessage: '' })}
          />
          <div className={styles['invalid-feedback']}>
            {getter && getter.errorMessage}
          </div>
        </div>
      )
    }
    case 'text':
    default: {
      return (
        <div className={styles['col']}>
          <input
            id={id ? id : undefined}
            className={getter && getter.error ? styles.invalid : undefined}
            type="text"
            placeholder={placeholder}
            value={getter ? getter.value : undefined}
            onChange={(e) => setter({ value: e.target.value, error: false, errorMessage: '' })}
          />
          <div className={styles['invalid-feedback']}>
            {getter && getter.errorMessage}
          </div>
        </div>
      )
    }
  }
}

export default FormInput;
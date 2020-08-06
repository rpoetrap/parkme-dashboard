import { FunctionComponent, Dispatch, SetStateAction } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import cx from 'classnames';

import styles from '../../pages/styles.module.scss';
import { InputState } from '../../types';

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
}

let reactSelectId = 1;

const FormInput: FunctionComponent<Props> = (props: Props) => {
	const { id, type, placeholder, setter, getter } = props;

  switch (type) {
    case 'dropdown': {
      const { data } = props;
      return (
        <div className={styles['col']}>
          <Select
            id={ id ? id : `react-select-${reactSelectId++}`}
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
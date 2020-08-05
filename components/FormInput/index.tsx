import { FunctionComponent, Dispatch, SetStateAction } from 'react';
import Select, { OptionTypeBase } from 'react-select';

import styles from '../../pages/styles.module.scss';

export interface OptionType extends OptionTypeBase {
  label: string;
  value: string;
}

interface Props {
	id?: string;
  type: string;
  placeholder?: string;
  data?: OptionType[];
  setter: Dispatch<SetStateAction<any>>;
  getter: any;
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
            styles={{ input: () => ({ boxShadow: 'none', 'input': { boxShadow: 'none', height: 'unset' } }) }}
            options={data}
            onChange={(data) => setter(data)}
            value={getter}
          />
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
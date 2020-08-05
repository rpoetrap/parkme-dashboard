import { FunctionComponent, Dispatch, SetStateAction } from 'react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';
import cx from 'classnames';

import styles from '../../pages/styles.module.scss';

interface OptionType extends OptionTypeBase {
  label: string;
  value: string;
}

interface Props {
	id?: string;
  type: string;
  placeholder?: string;
  data?: OptionsType<OptionType>;
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
        <Select
          id={ id ? id : `react-select-${reactSelectId++}`}
          styles={{ input: () => ({ boxShadow: 'none', 'input': { boxShadow: 'none' } }) }}
          options={data}
          onChange={(data) => setter(data)}
          value={getter}
        />
      )
    }
    case 'password': {
      return (
        <div className={cx(styles['col'], styles['mb-3'])}>
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
        <div className={cx(styles['col'], styles['mb-3'])}>
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
import { FunctionComponent, Dispatch, SetStateAction } from 'react';

import styles from '../../pages/styles.module.scss';

interface Props {
  type: string;
  placeholder?: string;
  setter: Dispatch<SetStateAction<any>>;
  getter: any;
}

const FormInput: FunctionComponent<Props> = (props: Props) => {
  const { type, placeholder, setter, getter } = props;

  switch (type) {
    case 'password': {
      return (
        <div className={styles['mb-3']}>
          <input
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
        <div className={styles['mb-3']}>
          <input
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
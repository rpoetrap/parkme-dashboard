import { FunctionComponent, Dispatch, SetStateAction } from "react";

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
        <input
          value={getter ? getter.value : undefined}
          type="password"
          placeholder={placeholder}
          onChange={(e) => setter({ value: e.target.value, error: false, errorMessage: '' })}
        />
      )
    }
    case 'text':
    default: {
      return (
        <input
          value={getter ? getter.value : undefined}
          type="text"
          placeholder={placeholder}
          onChange={(e) => setter({ value: e.target.value, error: false, errorMessage: '' })}
        />
      )
    }
  }
}

export default FormInput;
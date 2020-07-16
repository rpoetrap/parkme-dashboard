import { FunctionComponent, ReactNode } from "react";
import styles from './styles.module.scss';

interface Props {
  children?: ReactNode
}

export const Card: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.card}>
      {props.children}
    </div>
  )
}

export const CardBody: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.card_body}>
      {props.children}
    </div>
  )
}
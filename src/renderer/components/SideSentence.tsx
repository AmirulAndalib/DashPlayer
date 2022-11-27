import React, { Component } from 'react';
import SentenceT from '../lib/param/SentenceT';
import style from './css/Subtitle.module.css';

interface SideSentenceParam {
  sentence: SentenceT;
  onClick: (sentence: SentenceT) => void;
  itemKey: string;
}

export default class SideSentence extends Component<SideSentenceParam, any> {
  private readonly iconRef: React.RefObject<HTMLDivElement>;

  constructor(props: SideSentenceParam | Readonly<SideSentenceParam>) {
    super(props);
    this.iconRef = React.createRef<HTMLDivElement>();
  }

  public show(): void {
    if (this.iconRef.current !== null) {
      this.iconRef.current.style.visibility = 'visible';
    }
  }

  public hide(): void {
    if (this.iconRef.current !== null) {
      this.iconRef.current.style.visibility = 'hidden';
    }
  }

  render() {
    const { itemKey, sentence, onClick } = this.props;
    return (
      // todo 报错
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div
        key={itemKey}
        className={style.subtitleItem}
        onClick={() => {
          onClick(sentence);
        }}
      >
        <div className={style.subtitleItemIcon} ref={this.iconRef}>
          👺
        </div>
        <div className={style.subtitleItemText}>{sentence.text}</div>
      </div>
    );
  }
}

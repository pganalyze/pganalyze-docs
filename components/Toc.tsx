import React from 'react'

type ToCItem = {
  url: string;
  title: string;
  items?: ToCItem[];
}

const ToC: React.FC<{items?: ToCItem[]}> = ({items}) => {
  if (!items) {
    return null
  }
  return (
    <div className='toc'>
      <ToCContents items={items} depth={1}/>
    </div>
  )
}

const ToCContents: React.FC<{items: ToCItem[], depth: number}> = ({items, depth}) => {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.url}>
            <a href={item.url}>{item.title}</a>
            {item.items && <ToCContents items={item.items} depth={depth+1}/>}
          </li>
        )
      })}
    </ul>
  );
}

export default ToC;

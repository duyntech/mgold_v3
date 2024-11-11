import { Panel } from 'primereact/panel';
import { CustomPanelProps } from '../../types';
export default function CustomPanel(props:CustomPanelProps){
    const template = (options:any) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const className = `${options.className} justify-content-between`;
        const titleClassName = `${options.titleClassName} fami-text-primary`;
        const style = { fontSize: '1rem' };

        return (
            <div className={className}>
                <span className={titleClassName} style={style}>{props.header}</span>
                <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                    <span className={toggleIcon}></span>
                </button>
            </div>
        );
    }
    return (<Panel headerTemplate={template} toggleable={props.toggleable} collapsed={props.collapsed} className='pt-2'>
            <div className={props.className}>
                {props.body}    
            </div>
            
        </Panel>)
}
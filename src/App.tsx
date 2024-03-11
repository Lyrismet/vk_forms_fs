import {
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Group,
    usePlatform,
    Cell
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './App.css'
import {useState} from "react";

import CatFact from "./components/CatFact/CatFact.tsx";
import NameForAge from "./components/NameForAge/NameForAge.tsx";



function App() {
    const platform = usePlatform();
    const isVKCOM = platform === 'vkcom';
    const panels = ['Cat fact', 'Name for age'];
    const [panel, setPanel] = useState(panels[0]);

    return (
        <AppRoot>
            <SplitLayout
                style={{
                    justifyContent: 'center',
                    ...(window.innerWidth < 768 && {
                        flexDirection: 'column',
                    }),
                }}
                header={!isVKCOM && <PanelHeader delimiter="none"/>}
            >

                <SplitCol style={{
                    ...(window.innerWidth < 768 && {
                        height: '35%'
                    }),
                }}
                          fixed  width={window.innerWidth < 768 ? '100%' : '280px'} maxWidth={window.innerWidth < 768 ? '100%' : '280px'}>
                    <Panel>
                        {!isVKCOM && <PanelHeader/>}
                        <Group>
                            {panels.map((i) => (
                                <Cell key={i} hovered={i === panel} onClick={() => setPanel(i)}>
                                    {i}
                                </Cell>
                            ))}
                        </Group>
                    </Panel>
                </SplitCol>

                <SplitCol width="100%" maxWidth="760px" stretchedOnMobile autoSpaced>
                    <View activePanel={panel}>
                        <Panel id={panels[0]}>
                            <PanelHeader>Cat fact</PanelHeader>
                            <Group>
                                <CatFact/>
                            </Group>
                        </Panel>

                        <Panel id={panels[1]}>
                            <PanelHeader>Name for age</PanelHeader>
                            <Group>
                                <NameForAge/>
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    )
}

export default App


import {
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Group, usePlatform, useAdaptivityConditionalRender, Cell, Button, Placeholder,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './App.css'
import {useState} from "react";

function App() {
    const platform = usePlatform();
    const { viewWidth } = useAdaptivityConditionalRender();
    const isVKCOM = platform === 'vkcom';
    const panels = ['panel 1', 'panel 2'];
    const [panel, setPanel] = useState(panels[0]);
    return (
        <AppRoot>
            <SplitLayout
                style={{ justifyContent: 'center' }}
                header={!isVKCOM && <PanelHeader delimiter="none" />}
            >
                {viewWidth.tabletPlus && (
                    <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
                        <Panel>
                            {!isVKCOM && <PanelHeader />}
                            <Group>
                                {panels.map((i) => (
                                    <Cell key={i} hovered={i === panel} onClick={() => setPanel(i)}>
                                        {i}
                                    </Cell>
                                ))}
                            </Group>
                        </Panel>
                    </SplitCol>
                )}
                <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
                    <View activePanel={panel}>
                        <Panel id={panels[0]}>
                            <PanelHeader>Panel 1</PanelHeader>
                            <Group>
                                <Placeholder
                                    header="Уведомления от сообществ"
                                    action={<Button size="m">Подключить сообщества</Button>}
                                >
                                    Подключите сообщества, от которых Вы хотите получать уведомления
                                </Placeholder>
                            </Group>
                        </Panel>

                        <Panel id={panels[1]}>
                            <PanelHeader>Panel 2</PanelHeader>
                            <Group>
                                <Placeholder>Доступ запрещён</Placeholder>
                                <Placeholder header="Находите друзей" action={<Button size="m">Найти друзей</Button>}>
                                    Здесь будут отображаться люди, которых вы добавите в друзья
                                </Placeholder>
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    )
}

export default App

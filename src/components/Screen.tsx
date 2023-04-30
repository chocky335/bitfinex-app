import { StatusBar, StatusBarStyle } from 'expo-status-bar';

import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components/native';

interface ScreenProps extends PropsWithChildren {
  backgroundColor?: string,
  statusBarStyle?: StatusBarStyle
}

export const Screen: FC<ScreenProps> = ({
  children,
  statusBarStyle,
  backgroundColor
}) => (
    <Container backgroundColor={backgroundColor}>
        <SafeAreaView>
          {children}
        </SafeAreaView>

        <StatusBar style={statusBarStyle} />
    </Container>
);

const Container = styled.View<Pick<ScreenProps, 'backgroundColor'>>(({ backgroundColor }) => ({
  flex: 1,
  backgroundColor,
}))
const SafeAreaView = styled.SafeAreaView({
  flex: 1,
})

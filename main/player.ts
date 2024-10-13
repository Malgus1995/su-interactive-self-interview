import { RpgPlayer, type RpgPlayerHooks, Control, Components } from '@rpgjs/server'

const player: RpgPlayerHooks = {
    onConnected(player: RpgPlayer) {
        player.name = 'You'
        player.setComponentsTop(Components.text('{name}'))
    },
    onInput(player: RpgPlayer, { input }) {
        if (input == Control.Back) {
            player.callMainMenu()
        }
    },
    async onJoinMap(player: RpgPlayer) {
        if (player.getVariable('AFTER_INTRO')) {
            return
        }
        await player.showText('저의 자기소개 페이지에 오신걸 환영합니다.')
        await player.showText('화면에 나와 있는 물체들을 클릭해 보세요. 다 둘러 보셨으면 오른쪽 출구를 클릭하여 이동해 주세요.')
        player.setVariable('AFTER_INTRO', true)
    }
}

export default player
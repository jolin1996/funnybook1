let buttonBackgrounds = {
  normal: '../../dist/chat-button/button_normal.png',
  pressed: '../../dist/chat-button/button_pressed.png',
  busy: '../../dist/chat-button/button_busy.gif',
  disabled: '../../dist/chat-button/button_disabled.png',
}

Component({
  properties: {
    
  },

  data: {
    backgrounds: buttonBackgrounds,
    status: 'disabled', // normal, pressed, busy, disabled
  },

  methods: {
    touchStart: function(e) {
      // methods内的函数中可以直接用this访问组件实例
      // properties中的数据也是用this.data访问，而不是this.properties
      if (this.data.status == 'normal') {
        this.triggerEvent('recordstart');
      }
    },

    touchEnd: function(e) {
      if(this.data.status == 'pressed') {
        this.triggerEvent('recordend');
      }
    },

    setStatus: function(newStatus) {
      this.setData({status: newStatus});
    }
  }
});
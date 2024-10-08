
(function (window, $, Login, Dialogify, Cookies) {
    'use strict';

    const ITEM_STONE = 4;

    class DonateModel {
        constructor(serviceData) {
            this.userItems = 0;
            this.donateItems = 0;
            this.tempText = '';
            this.anonymous = false;
            this.isDonatable = false;
            this.serviceData = serviceData;
        }

        async fetchUserItems() {
            return {data: [null, null, null, null, {num: 1500}]};
        }

        async createItemOrder() {
            return;
        }

        async fetchIsDonatable() {
            return {data: {donatable: true}};
        }

        get userItemsIsEmpty() {
            return this.userItems == 0;
        }

        get donateItemsIsEmpty() {
            return this.donateItems == 0;
        }

        get userItemsRemainingNum() {
            return this.userItems - this.donateItems;
        }

        get isLogin() {
            return Login.isLogin();
        }
    }

    class DonateView {
        constructor(presenter) {
            this.presenter = presenter;
            this.animateTimeout = [];
        }

        setNormalDialogify(anonymous, tempText) {
            nunjucks.configure({ autoescape: false });
            let dialogHtml = nunjucks.render('common/donate_dialog.njk.html');
            this.dialog = new Dialogify(dialogHtml, {
                useDialogForm: false,
                dialog: {
                    className: 'dialogify_donate-style',
                    style: { 'overflow': 'visible' }
                }
            }).title('贊助支持');

            this.dialog.$donateContent = this.dialog.$content.find('.dialogify_donate:not(.dialogify_donate_ec):not(.dialogify_donate_pay)');
            this.dialog.$purchaseContent = this.dialog.$content.find('.dialogify_donate_ec');
            this.dialog.$payContent = this.dialog.$content.find('.dialogify_donate_pay');

            if (this.presenter.options.textInput && !this.presenter.options.anonymousOnly) {
                // 直接設定 baha_gif 會有搜尋框無法 focus 問題，需放在 dialog show 事件之後
                this.dialog.on('show', () => {
                    this.initialTextInput(tempText, anonymous);
                });
            }

            this.dialog.$content.find('.dialogify_donat_sign-in').hide();
            this.bindAddDonateItemButtonBubblyAnimatenAndEvent();
            this.bindAnonymousCheckboxEvent(anonymous);
            this.dialog.$donateContent.find('.dialogify_donate_bar > a').click(
                () => this.presenter.callPurchase()
            );
        }

        updateAddDonateItemButton(remainingItems) {
            let $buttons = this.dialog.$donateContent.find(`.bubbly-button[data-add]`);
            $buttons.each(function(){
                if ($(this).data('add') > remainingItems) {
                    $(this).find('div').addClass('is-empty');
                } else {
                    $(this).find('div').removeClass('is-empty');
                }
            });
        }

        addDonateItemButtonClicked(count) {
            let $buttonAtag = this.dialog.$donateContent.find(`.bubbly-button[data-add="${count}"]`);
            $buttonAtag.removeClass('animate');
            $buttonAtag.width($buttonAtag.width()); // forces layout reflow
            $buttonAtag.addClass('animate');
            clearTimeout(this.animateTimeout[count]);
            this.animateTimeout[count] = setTimeout(() => $buttonAtag.removeClass('animate'), 700);
        }

        setDonateItem(items) {
            this.dialog.$donateContent.find('.donate_input input').val(items).triggerHandler('input');
        }

        relayoutDonatedItemsList(items) {
            this.enableSubmit();
            this.setDonateItem(items);
        }

        bindAddDonateItemButtonBubblyAnimatenAndEvent() {
            let view = this;
            view.dialog.$donateContent.find('.bubbly-button').each(function () {
                this.addEventListener('click', function (e) {
                    e.preventDefault();
                    view.presenter.addDonateItem(+$(this).data('add'));
                }, false);
            });
        }

        setDonateInputAction() {
            let view = this;
            let $input = this.dialog.$donateContent.find('.donate_input input');
            $input.off('focus change input')
                .on('focus', function() {
                    this.select();
                })
                .on('change input', function() {
                    let value = $(this).val();
                    if (value === '') {
                        view.hideDonateInputClearBtn();
                    } else {
                        view.showDonateInputClearBtn();
                    }

                    value = +value;
                    if (isNaN(value) || !/^[0-9]+$/.test(value)) {
                        view.showDonateInputError();
                    } else {
                        view.hideDonateInputError();
                        view.presenter.setDonateItem(value);
                    }
                });

            let $clearBtn = this.dialog.$donateContent.find('.clearall');
            $clearBtn.click(() => $input.val('').triggerHandler('input'));
        }

        showDonateInputClearBtn() {
            let $clearBtn = this.dialog.$donateContent.find('.clearall');
            $clearBtn.addClass('is-active');
        }

        hideDonateInputClearBtn() {
            let $clearBtn = this.dialog.$donateContent.find('.clearall');
            $clearBtn.removeClass('is-active');
        }

        showDonateInputError(showSpan) {
            let $inputDiv = this.dialog.$donateContent.find('.donate_input');
            $inputDiv.addClass('is-error');
            if (showSpan) {
                $inputDiv.find('span.is-error').show();
            }
        }

        hideDonateInputError() {
            let $inputDiv = this.dialog.$donateContent.find('.donate_input');
            $inputDiv.removeClass('is-error').find('span.is-error').hide();
        }

        setSubmitToDonateAction() {
            let $submitButton = this.dialog.$donateContent.find('.dialogify_donate_footer > .donate-submit');
            $submitButton.off('click');
            $submitButton.click(() => this.presenter.submitDonate());
            $submitButton.text('贊助');
        }

        setSubmitToPurchaseAction() {
            this.enableSubmit();
            let $submitButton = this.dialog.$donateContent.find('.dialogify_donate_footer > .donate-submit');
            $submitButton.off('click');
            $submitButton.click(() => this.presenter.callPurchase());
            $submitButton.text('購買煉金石');
        }

        setPurchaseConfirmAction() {
            let $confirmButton = this.dialog.$purchaseContent.find('.dialogify_donate_footer .btn-primary');
            $confirmButton.off('click').on('click', () => this.presenter.createItemOrder());
        }

        setPurchaseSelectItemAction() {
            this.dialog.$purchaseContent.find('[data-item-sn]').off('click').on('click', (e) => {
                let $target = $(e.target);
                if (!$target.is('[data-item-sn]')) {
                    $target = $target.parents('[data-item-sn]');
                }

                if (!$target.hasClass('is-active')) {
                    this.dialog.$purchaseContent.find('[data-item-sn].is-active').removeClass('is-active');
                    $target.addClass('is-active');

                    let price = new Intl.NumberFormat().format($target.data('item-price'));
                    $('.donate_ec_total h4').text('NT $' + price);
                }
            });
        }

        setPurchaseInvoiceChangeAction() {
            let $invoiceSelect = this.dialog.$purchaseContent.find('#donatePurchaseInvoice');
            $invoiceSelect.off('change').on('change', (e) => {
                if($(e.target).selectedIndex != 0) {
                    let itemSn = +this.dialog.$purchaseContent.find('[data-item-sn].is-active').data('item-sn');
                    window.open('https://buy.gamer.com.tw/vItem.php?sn=v' + itemSn);
                    this.closeDialog();
                }
            });
        }

        setPurchaseToggleDetailAction() {
            this.dialog.$purchaseContent.find('.slideup').off('click')
                .on('click', () => {
                    this.dialog.$purchaseContent.find('.slideup').toggleClass('is-slideup');
                    this.dialog.$purchaseContent.find('.payway-virtual-block').toggle('fast');
                });
        }

        setPurchasePaywayAction() {
            this.dialog.$purchaseContent.find('.payway-virtual-block input[name="donatePurchasePayway"]').off('change')
                .on('change', (e) => {
                    window.localStorage.setItem('DONATE_payway', $(e.target).val());

                    let $select = $(e.target).next('.checkout-mark').find('img');
                    this.dialog.$purchaseContent.find('.payway-box img')
                        .attr({
                            src: $select.attr('src'),
                            alt: $select.attr('alt')
                        });
                });

            let latestPayway = window.localStorage.getItem('DONATE_payway');
            if ([1, 5, 9, 10, 11].includes(+latestPayway)) {
                this.dialog.$purchaseContent.find('.payway-virtual-block input[name="donatePurchasePayway"]')
                    .filter('[value="' + latestPayway + '"]')
                    .prop('checked', true)
                    .change();
            }
        }

        setPaymentAction(paymentData) {
            this.dialog.$payContent.find('.btn-primary').off('click').on('click', () => {
                this.paymentWindow = window.open(paymentData.paymentUrl, 'donatePurchasePayment');
                this.paymentWindowCount = 1;
                this.paymentWindowTimer = setInterval(() => {
                    if (!this.paymentWindow) {
                        clearInterval(this.paymentWindowTimer);
                    } else if (this.paymentWindow.closed) {
                        clearInterval(this.paymentWindowTimer);
                        this.closeDialog();
                        this.presenter.init(true);
                    }

                    if (this.paymentWindowCount > 1200) {
                        clearInterval(this.paymentWindowTimer);
                    }

                    this.paymentWindowCount++;
                }, 1000);
            });
            this.dialog.$payContent.show();
        }

        getPurchaseFormData() {
            let verifyCode = Login.getUserid() + (Math.floor(Date.now() / 1000));

            let $c = this.dialog.$purchaseContent;
            let itemSn = +$c.find('[data-item-sn].is-active').data('item-sn');
            let itemQuantity = +$c.find('[data-item-sn].is-active').data('item-quantity');
            let payway = +$c.find('[name="donatePurchasePayway"]:checked').val();
            let bonus = +$c.find('#donatePurchaseBonus').val() || 0;

            let formData = new FormData();
            formData.append('verifyCode', verifyCode);
            formData.append('payway', payway);
            formData.append('bonus', bonus);
            formData.append('item', itemSn);
            formData.append('quantity', itemQuantity);

            return formData;
        }

        getDonateFormData() {
            let formData = new FormData();
            if (this.presenter.options.textInput) {
                let $textInput = this.dialog.$donateContent.find('#textInput');
                formData.append('text', $textInput.val());
            }

            return formData;
        }

        enableSubmit() {
            this.dialog.$donateContent.find('.dialogify_donate_footer > .donate-submit')
                .prop('disabled', false)
                .removeClass('is-disabled');
        }

        disableSubmit() {
            this.dialog.$donateContent.find('.dialogify_donate_footer > .donate-submit')
                .prop('disabled', true)
                .addClass('is-disabled');
        }

        enablePurchaseSubmit() {
            this.dialog.$purchaseContent.find('.dialogify_donate_footer .btn-primary')
                .prop('disabled', false)
                .text('送出訂單')
                .removeClass('is-disabled');
        }

        disablePurchaseSubmit() {
            this.dialog.$purchaseContent.find('.dialogify_donate_footer .btn-primary')
                .prop('disabled', true)
                .text('處理中...')
                .addClass('is-disabled');
        }

        updateCallPurchaseBlock(userItems) {
            let $donateBar = this.dialog.$donateContent.find('.dialogify_donate_bar');
            let $donateBarText = $donateBar.find('p');
            let $donateBarBtn = $donateBar.find('a');
            if (userItems == 0) {
                $donateBar.addClass('is-warning');
                $donateBarText.text('你沒有煉金石，立即加入贊助行列！');
                $donateBarBtn.text('立即購買');
            } else {
                $donateBar.removeClass('is-warning');
                $donateBarText.html(`目前擁有煉金石 <a href="https://home.gamer.com.tw/donate_give.php" target="_blank">${userItems}</a> 個`);
                $donateBarBtn.text('前往加值');
            }
        }

        showPurchaseLayout() {
            this.dialog.$content
                .parent().css({'overflow-y': 'auto', 'max-height': '90vh'})
                .parent().css('max-width', '100%');

            let bonus = 0;
            this.dialog.$purchaseContent.find('#donatePurchaseBonus').attr('max', bonus);
            this.dialog.$purchaseContent.find('#bonusTotal').data('bonus', bonus).find('span').text(bonus);
            this.dialog.$donateContent.hide();
            this.dialog.$purchaseContent.show();
            this.dialogClosable = false;
        }

        showPaymentLayout(paymentData) {
            let quantity = paymentData.quantity * paymentData.orderQuantity;
            let price = paymentData.price * paymentData.orderQuantity;

            this.dialog.$purchaseContent.hide();
            this.dialog.$payContent
                .find('.img-box img').prop('src', paymentData.image).end()
                .find('.donate_qyt').text('x' + quantity).end()
                .find('.dialogify_donate_giftbox p').text(`${paymentData.title} ${quantity} 個`).end()
                .find('.btn-primary span').first().text(paymentData.paywayTitle).end().last().text(price);

            this.setPaymentAction(paymentData);
        }

        setNotLoginDialogify() {
            nunjucks.configure({ autoescape: false });
            let dialogHtml = nunjucks.render('common/donate_dialog.njk.html');
            this.dialog = new Dialogify(dialogHtml, {
                useDialogForm: false,
                dialog: {
                    className: 'dialogify_donate-style',
                    style: { 'overflow': 'visible' }
                }
            }).title('贊助支持');
            this.dialog.$content.find('.dialogify_donate').hide();
            this.dialog.$content.find('.dialogify_donat_sign-in a').click(() => this.presenter.login());
        }

        bindAnonymousCheckboxEvent(anonymous) {
            let view = this;
            let $anonymousCheckbox = this.dialog.$content.find('#check-anonymous');
            let $textTooltip = $anonymousCheckbox.next().find('.text-tooltip');

            if (this.presenter.options.anonymousOnly) {
                $anonymousCheckbox.prop({
                    checked: true,
                    disabled: true
                });
            }else {
                $anonymousCheckbox.prop('checked', anonymous);
            }

            $anonymousCheckbox.change(function () {
                view.presenter.updateAnonymous(this.checked);

                let $textInput = view.dialog.$donateContent.find('#textInput');
                let $textInputContainer = $textInput.parents('div.col-12');
                if (this.checked) {
                    $textTooltip.html('已勾選匿名支持<br>只有創作者知道贊助人');
                    view.presenter.options.textInput && $textInputContainer.hide('fast');
                } else {
                    $textTooltip.html('將以匿名顯示你的贊助<br>但創作者仍會知道贊助者是誰');
                    view.presenter.options.textInput && $textInputContainer.show('fast');
                    $textInput.triggerHandler('input');
                }
            }).change();
        }

        initialTextInput(tempText, anonymous) {
            let options = this.presenter.options.textInput;
            let $textInput = this.dialog.$donateContent.find('#textInput');
            let $buttons = $textInput.next('.comment_icon');

            if (options.placeholder) {
                $textInput.attr('placeholder', options.placeholder)
            }

            if (!options.enableBahaGif && !options.enableInsertImage) {
                $buttons.hide();
            } else {
                // require js/plugins/sticker.js
                if (options.enableBahaGif) {
                    new Bahamut.Sticker('.donate_input-com a.gif_box_emoji', ref => {
                        return {
                            insertType: Bahamut.Sticker.INSERT_TYPE_URL,
                            editor: $(ref).parents('.donate_input-com').find('#textInput').get(0)
                        };
                    }, {
                        appendTo: document.querySelector('.dialogify[open]')
                    });
                } else {
                    $buttons.find('.gif_box').hide();
                }

                // require js/plugins/truth_image.js
                if (options.enableInsertImage) {
                    $buttons.find('.insert-image').on('click', () => {
                        var dialog = new Bahamut.TruthImage();
                        dialog.setEditor($textInput);
                        dialog.showDialog();
                    }).hover(
                        function(){$(this).find('img').attr('src', 'https://i2.bahamut.com.tw/forum/icons/comment_image_active.svg');},
                        function(){$(this).find('img').attr('src', 'https://i2.bahamut.com.tw/forum/icons/comment_image.svg');},
                    );
                } else {
                    $buttons.find('.insert-image').hide();
                }
            }

            let presenter = this.presenter;
            $textInput.on('input focus', function(){
                presenter.updateText($textInput.val());
                $(this).height(20);
                $(this).height(this.scrollHeight - 28);
            });
            $textInput.text(tempText);

            if (anonymous) {
                $textInput.parents('div.col-12').hide();
            } else {
                $textInput.parents('div.col-12').show();
                $textInput.triggerHandler('input');
            }
        }

        showDialog() {
            this.dialog.showModal();
        }

        closeDialog() {
            this.dialog.close();
        }

        showSystemError(error) {
            Dialogify.alert('系統忙碌中');
            console.error(error);
        }

        showAlert(message, callback) {
            Dialogify.alert(message, {close: callback});
        }

        set dialogClosable(closable){
            this.dialog.options.closable = closable;
        }
    }

    class DonatePresenter {
        constructor(serviceData, options) {
            this.model = new DonateModel(serviceData);
            this.view = new DonateView(this);
            this.options = options || {};
        }

        init(forceUpdate) {
            // reset model
            this.model.donateItems = 0;
            this.model.anonymous = this.options.anonymousOnly || false;
            this.model.isDonatable = false;
            this.model.tempText = '';
            if (!this.model.isLogin) {
                this.view.setNotLoginDialogify();
                this.view.showDialog();
                return;
            }
            this.simpleRespHandler(
                () => this.model.fetchIsDonatable(),
                (data) => {
                    if (!data.donatable) {
                        this.view.showAlert('因故站方關閉此文贊助，暫停使用中。');
                        return;
                    }

                    this.simpleRespHandler(
                        () => this.model.fetchUserItems(forceUpdate),
                        (data) => {
                            this.model.isDonatable = true;
                            this.model.userItems = data[ITEM_STONE].num;
                            this.updateDialog();
                            this.view.showDialog();
                        }
                    );
                }
            );
        }

        reopenDialog() {
            if (!this.model.isLogin) {
                this.view.setNotLoginDialogify();
                this.view.showDialog();
                return;
            }

            if (this.model.isDonatable) {
                this.updateDialog();
                if (!this.model.donateItemsIsEmpty) {
                    this.view.relayoutDonatedItemsList(this.model.donateItems);
                }
                this.view.showDialog();
            } else {
                this.view.showAlert('因故站方關閉此文贊助，暫停使用中。');
            }
        }

        updateDialog() {
            this.view.setNormalDialogify(this.model.anonymous, this.model.tempText);
            this.view.updateCallPurchaseBlock(this.model.userItems);
            this.view.updateAddDonateItemButton(this.model.userItemsRemainingNum);
            this.view.setSubmitToDonateAction();
            this.view.setDonateInputAction(this.model.userItemsIsEmpty);
            this.view.setPurchaseConfirmAction();
            this.view.setPurchaseInvoiceChangeAction();
            this.view.setPurchaseSelectItemAction();
            this.view.setPurchaseToggleDetailAction();
            this.view.setPurchasePaywayAction();

            if (this.model.donateItemsIsEmpty) {
                this.view.disableSubmit();
            }

            if (this.model.userItemsIsEmpty) {
                this.view.setSubmitToPurchaseAction();
            }
        }

        callPurchase() {
            this.view.showPurchaseLayout();
        }

        createItemOrder() {
            this.view.disablePurchaseSubmit();
            this.view.showAlert('已完成付款', () => {
                this.view.closeDialog();
                this.init(true);
            });
        }

        addDonateItem(count) {
            if (this.model.userItemsRemainingNum - count < 0) {
                return;
            }

            this.model.donateItems += count;

            this.view.enableSubmit();
            this.view.hideDonateInputError();
            this.view.setDonateItem(this.model.donateItems);
            this.view.addDonateItemButtonClicked(count);
            this.view.updateAddDonateItemButton(this.model.userItemsRemainingNum);
        }

        setDonateItem(items) {
            if (this.model.userItemsIsEmpty) {
                return;
            }

            this.model.donateItems = items;
            this.view.updateAddDonateItemButton(this.model.userItemsRemainingNum);
            if (this.model.userItems < this.model.donateItems) {
                this.view.disableSubmit();
                this.view.showDonateInputError(true);
            } else if(this.model.donateItems == 0) {
                this.view.disableSubmit();
            } else {
                this.view.enableSubmit();
            }
        }

        updateAnonymous(anonymous) {
            this.model.anonymous = anonymous;
        }

        updateText(text) {
            this.model.tempText = text;
        }

        submitDonate() {
            return;
        }

        login() {
            let loc = window.location;
            let parameter = this.options.loginReturnUrlParameter || '';
            let returnUrl = 'https://' + loc.host + loc.pathname + loc.search + parameter;
            Cookies.set('ckFrom', returnUrl, {path: '/', domain: '.gamer.com.tw'});
            location.href = 'https://user.gamer.com.tw/login.php';
        }

        simpleRespHandler(request, callback) {
            try {
                request().then(
                    (json) => {
                        if (json.error) {
                            this.view.showAlert(json.error.message);
                            return;
                        }
                        callback(json.data);
                    }
                ).catch(

                    (error) => this.view.showSystemError(error)
                );
            } catch (error) {
                (error) => this.view.showSystemError(error)
            }
        }
    }

    window.Bahamut = window.Bahamut || {};
    window.Bahamut.Donate = DonatePresenter;
})(window, jQuery, {
    isLogin: () => true
}, Dialogify, {
    set: () => {}
});

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["common/donate_dialog.njk.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"all-dialogify_donate\">\n    <div class=\"dialogify_donat_sign-in text-center\">\n        <div class=\"imgbox\"><img src=\"https://i2.bahamut.com.tw/donate/mascot-heart.png\"></div>\n        <h3>你的鼓勵將是創作者最大動力</h3>\n        <div class=\"dialogify_donate_footer\">\n            <a class=\"btn btn-primary\" href=\"https://user.gamer.com.tw/login.php\">立即登入贊助創作</a>\n        </div>\n    </div>\n    <div class=\"dialogify_donate\">\n        <div class=\"dialogify_donate_bar space-between\">\n            <p>你沒有煉金石，立即加入贊助行列！</p>\n            <a>立即購買</a>\n        </div>\n        <div class=\"dialogify_donate_giftbox\">\n            <div class=\"row\">\n                <div class=\"col-3 text-center\">\n                    <a class=\"bubbly-button\" href=\"javascript:;\" data-add=\"1\">\n                        <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\">\n                            <span class=\"donate_gift_used\">+1</span>\n                            <p class=\"donate_qyt\">+1</p>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-3 text-center\">\n                    <a class=\"bubbly-button\" href=\"javascript:;\" data-add=\"10\">\n                        <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\">\n                            <span class=\"donate_gift_used\">+10</span>\n                            <p class=\"donate_qyt\">+10</p>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-3 text-center\">\n                    <a class=\"bubbly-button\" href=\"javascript:;\" data-add=\"100\">\n                        <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\">\n                            <span class=\"donate_gift_used\">+100</span>\n                            <p class=\"donate_qyt\">+100</p>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-3 text-center\">\n                    <a class=\"bubbly-button\" href=\"javascript:;\" data-add=\"1000\">\n                        <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\">\n                            <span class=\"donate_gift_used\">+1000</span>\n                            <p class=\"donate_qyt\">+1000</p>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-12\">\n                    <div class=\"donate_input\">\n                        <input type=\"text\" pattern=\"^[0-9]+$\" required class=\"form-control\" placeholder=\"請點圖示或直接輸入數字\">\n                        <img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\">\n                        <p>贊助數量</p>\n                        <span class=\"is-error\" style=\"display: none\">你擁有的煉金石不夠喲</span>\n                        <a class=\"clearall\"></a>\n                    </div>\n                </div>\n\n                <div class=\"col-12\" style=\"display:none;\">\n                    <div class=\"donate_input-com\">\n                        <textarea id=\"textInput\" class=\"form-control\"></textarea>\n                        <div class=\"comment_icon\">\n                            <a class=\"gif_box gif_box_emoji\" href=\"javascript:;\" title=\"插入貼圖\">\n                                <img title=\"插入貼圖\" src=\"https://i2.bahamut.com.tw/forum/icons/comment_emoji.svg\">\n                            </a>\n                            <a class=\"insert-image\" href=\"javascript:;\" title=\"插入圖片\">\n                                <img src=\"https://i2.bahamut.com.tw/forum/icons/comment_image.svg\">\n                            </a>\n                        </div>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"dialogify_donate_footer\">\n            <a class=\"btn btn-primary donate-submit\">贊助</a>\n            <div class=\"space-between\">\n                <small>使用即代表同意\n                    <a>使用條款\n                        <span class=\"text-tooltip\">\n                            <ul>\n                                <li>經贊助介面送出煉金石後，即無法取消收回。</li>\n                                <li>經贊助介面送出煉金石為無償贈與之鼓勵行為，<br>不得主張以煉金石兌換任何其他商品及服務。</li>\n                                <li>經贊助介面發出的留言，仍可被管理者或屋主刪除。</li>\n                            </ul>\n                        </span>\n                    </a>\n                </small>\n                <ul class=\"check-box\">\n                    <li>\n                        <div class=\"check-group\">\n                            <input id=\"check-anonymous\" type=\"checkbox\">\n                            <label for=\"check-anonymous\" class=\"is-active\">\n                                <div class=\"label-icon\"> <i class=\"fa fa-check\"> </i> </div>\n                                <h6>匿名贊助\n                                    <span class=\"text-tooltip\">將以匿名顯示你的贊助<br>但創作者仍會知道贊助者是誰</span>\n                                </h6>\n                            </label>\n                        </div>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"dialogify_donate dialogify_donate_ec\" style=\"display: none\">\n        <p>未使用完的煉金石會持續保存，方便你隨時聲援贊助唷！</p>\n        <div class=\"dialogify_donate_select_gift\">\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <a herf=\"javascript:;\" data-item-sn=\"3281\" data-item-quantity=\"1\" data-item-price=\"30\">\n                        <div class=\"space-between\">\n                            <div>\n                                <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\"></div>\n                                <p>煉金石 x 100</p>\n                            </div>\n                            <div>\n                                <p class=\"gift_pic\">NT $30</p>\n                            </div>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-12\">\n                    <a herf=\"javascript:;\" data-item-sn=\"3281\" data-item-quantity=\"5\" data-item-price=\"150\" class=\"is-active\">\n                        <div class=\"space-between\">\n                            <div>\n                                <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\"></div>\n                                <p>煉金石 x 500</p>\n                            </div>\n                            <div>\n                                <p class=\"gift_pic\">NT $150</p>\n                            </div>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-12\">\n                    <a herf=\"javascript:;\" data-item-sn=\"3282\" data-item-quantity=\"1\" data-item-price=\"297\">\n                        <div class=\"space-between\">\n                            <div>\n                                <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\"></div>\n                                <p>煉金石 x 1000</p>\n                            </div>\n                            <div>\n                                <p class=\"gift_pic\"><span>折扣 1%</span>NT $297</p>\n                            </div>\n                        </div>\n                    </a>\n                </div>\n                <div class=\"col-12\">\n                    <a herf=\"javascript:;\" data-item-sn=\"3283\" data-item-quantity=\"1\" data-item-price=\"588\">\n                        <div class=\"space-between\">\n                            <div>\n                                <div class=\"img-box\"><img src=\"https://i2.bahamut.com.tw/donate/donate_item00.png\"></div>\n                                <p>煉金石 x 2000</p>\n                            </div>\n                            <div>\n                                <p class=\"gift_pic\"><span>折扣 2%</span>NT $588</p>\n                            </div>\n                        </div>\n                    </a>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"payway-box space-between\">\n            <div>\n                <h3>付款方式</h3>\n                <small>捐贈發票、不使用紅利</small>\n            </div>\n\n            <div class=\"flex\">\n                <div class=\"checkout-mark_s\">\n                    <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_LinePay.png\" alt=\"linepay\">\n                </div>\n                <a class=\"slideup\" href=\"javascript:;\">\n                    <i class=\"fa fa-angle-down float-right\"></i>\n                </a>\n            </div>\n        </div>\n\n        <div class=\"payway-virtual-block\" style=\"display: none\">\n            <label class=\"payway_item\">\n                <div class=\"checkout-virtual-radio\">\n                    <input type=\"radio\" name=\"donatePurchasePayway\" value=\"9\" checked=\"checked\">\n                    <div class=\"checkout-mark\">\n                        <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_LinePay.png\" alt=\"linepay\">\n                    </div>\n                </div>\n            </label>\n\n            <label class=\"payway_item\">\n                <div class=\"checkout-virtual-radio\">\n                    <input type=\"radio\" name=\"donatePurchasePayway\" value=\"1\">\n                    <div class=\"checkout-mark\">\n                        <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_SmartPay.png\" alt=\"網路 ATM\">\n                    </div>\n                </div>\n            </label>\n\n            <label class=\"payway_item\">\n                <div class=\"checkout-virtual-radio\">\n                    <input type=\"radio\" name=\"donatePurchasePayway\" value=\"5\">\n                    <div class=\"checkout-mark\">\n                        <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_FamiPort.png\" alt=\"FamiPort\">\n                    </div>\n                </div>\n            </label>\n\n\n            <label class=\"payway_item google-block\">\n                <div class=\"checkout-virtual-radio\">\n                    <input type=\"radio\" name=\"donatePurchasePayway\" value=\"10\">\n                    <div class=\"checkout-mark\">\n                        <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_GooglePay.png\" alt=\"Google Pay\">\n                    </div>\n                </div>\n            </label>\n\n            <label class=\"payway_item apple-block\">\n                <div class=\"checkout-virtual-radio\">\n                    <input type=\"radio\" name=\"donatePurchasePayway\" value=\"11\">\n                    <div class=\"checkout-mark\">\n                        <img src=\"https://i2.bahamut.com.tw/newgshop/payway_img_ApplePay.png\" alt=\"Apple Pay\">\n                    </div>\n                </div>\n            </label>\n\n            <div class=\"flex\">\n                <div>\n                    <select class=\"dropdown-group\" id=\"donatePurchaseInvoice\">\n                        <option selected=\"selected\" value=\"1\">捐贈發票</option>\n                        <option value=\"0\">其它發票或統編</option>\n                    </select>\n                </div>\n                <div>\n                    <div class=\"bonus-info-block\">\n                        <p id=\"bonusTotal\" data-bonus=\"0\">擁有紅利 <span>0</span>，本次折抵</p>\n                        <input type=\"text\" pattern=\"^[0-9]+$\" required id=\"donatePurchaseBonus\" placeholder=\"0\" value=\"0\">\n                        <p>點</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"dialogify_donate_footer\">\n            <div class=\"space-between\">\n                <small>結帳即同意\n                    <a class=\"have_popper\" target=\"_blank\" href=\"https://user.gamer.com.tw/help/detail.php?sn=396\">服務條款\n                        <span class=\"text-tooltip\">此為一次性消費虛擬商品，付款交易完成後即無法退/換貨。<br>此商品僅可透過”贊助”無償贈與，不得兌換/轉讓/交易其它商品及服務。</span>\n                    </a>\n                </small>\n                <div class=\"donate_ec_total\">\n                    <p>小計</p>\n                    <h4>NT $150</h4>\n                </div>\n\n            </div>\n            <div class=\"btn-box\">\n                <a href=\"javascript:;\" class=\"btn btn-primary\">送出訂單</a>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"dialogify_donate dialogify_donate_pay text-center\" style=\"display:none;\">\n        <h3>還差一步就完成！請於點擊結帳後儘快完成交易</h3>\n        <div class=\"dialogify_donate_giftbox\">\n            <div class=\"img-box\"><img src=\"\"><span class=\"donate_qyt\"></span></div>\n            <p></p>\n        </div>\n        <div class=\"dialogify_donate_footer\">\n            <a href=\"javascript:;\" class=\"btn btn-primary\"><span></span> 結帳．$<span></span></a>\n        </div>\n    </div>\n\n</div>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();


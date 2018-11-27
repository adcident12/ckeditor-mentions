$( document ).ready(function() {
    $('#submit').click(function(){
        var data = CKEDITOR.instances.editor.getData();
        if( data ) {
            console.log( data );
        }else {
            alert("Please fill in something!.");
        }
    });
    $('#append').click(function(){
        var username = 'myoung';
        var fullname = 'Mary Young';
        var content = createMentionHtml(username, fullname);
        CKEDITOR.instances.editor.insertHtml(content);
    });

    $.getJSON('/data.php', function ( users ) {
        CKEDITOR.replace( 'editor', {
            plugins: 'mentions,emoji,basicstyles,undo,link,wysiwygarea,toolbar',
            contentsCss: [
                'https://cdn.ckeditor.com/4.11.1/full-all/contents.css',
                'https://sdk.ckeditor.com/samples/assets/mentions/contents.css'
            ],
            height: 150,
            toolbar: [
                { name: 'document', items: [ 'Undo', 'Redo' ] },
                { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline' ] },
                { name: 'links', items: [ 'EmojiPanel', 'Link', 'Unlink' ] }
            ],
            removeDialogTabs: 'image:advanced;link:advanced;link:target',
            mentions: [
                {
                    feed: dataFeed,
                    itemTemplate: '<li data-id="{id}">' +
                            '<img class="photo" src="{avatar}" />' +
                            '<strong class="fullname">{fullname}</strong>' +
                        '</li>',
                    outputTemplate: createMentionHtml('{username}', '{fullname}'),
                    minChars: 0
                },
            ]
        } );

        function dataFeed( opts, callback ) {
            var matchProperty = 'username',
                data = users.filter( function( item ) {
                    return item[ matchProperty ].indexOf( opts.query.toLowerCase() ) == 0;
                } );
            data = data.sort( function( a, b ) {
                return a[ matchProperty ].localeCompare( b[ matchProperty ], undefined, { sensitivity: 'accent' } );
            } );
            callback( data );
        }
    });
});

function createMentionHtml(username, fullname){
    return '<a href="mailto:'+username+'@example.com">@'+fullname+'</a>';
}

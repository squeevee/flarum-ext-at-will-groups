<?php

// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

namespace Squeevee\AtWillGroups\Listener;

use DirectoryIterator;

use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureWebApp;

use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addForumAssets']);
        $events->listen(ConfigureWebApp::class, [$this, 'addAdminAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    public function addForumAssets(ConfigureWebApp $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__.'/../../js/forum/dist/extension.js',
                __DIR__.'/../../less/forum.less'
            ]);
            $event->addBootstrapper('squeevee/at-will-groups/main');
        }
    }

    public function addAdminAssets(ConfigureWebApp $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__.'/../../js/admin/dist/extension.js'
            ]);
            $event->addBootstrapper('squeevee/at-will-groups/main');
        }
    }

    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__ . '/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.' . $file->getExtension()), $file->getPathname());
            }
        }
    }
}
